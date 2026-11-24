import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
} from '../database/notification.entity';
import { ProjectMembers } from '../database/project-members.entity';
import { User } from '../database/user.entity';

type NotificationDraft = {
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
};

@Injectable()
export class UserNotifier {
  private readonly logger = new Logger(UserNotifier.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProjectMembers)
    private membersRepository: Repository<ProjectMembers>,
  ) {}

  async welcome(userId: string, firstName: string): Promise<void> {
    await this.send([userId], {
      type: NotificationType.SYSTEM,
      title: `Bienvenue sur Primo, ${firstName} !`,
      message:
        'Recherchez une adresse sur la carte, ouvrez une parcelle, puis créez votre premier projet pour la suivre en équipe.',
      metadata: { welcomeNotification: true },
    });
  }

  async adminGranted(userId: string): Promise<void> {
    await this.send([userId], {
      type: NotificationType.SYSTEM,
      title: 'Vous êtes administrateur',
      message:
        'Reconnectez-vous pour faire apparaître l’onglet Administration dans la barre de navigation.',
      metadata: { adminGranted: true },
    });
  }

  async invitationDeclined(
    projectId: string,
    projectName: string,
    inviteeId: string,
  ): Promise<void> {
    const [invitee, admins] = await Promise.all([
      this.userRepository.findOneBy({ id: inviteeId }),
      this.membersRepository.findBy({
        projectId,
        isAdmin: true,
        isPending: false,
      }),
    ]);
    const actorName = invitee ? this.fullName(invitee) : 'Un utilisateur';
    await this.send(
      admins.map((admin) => admin.userId),
      {
        type: NotificationType.PROJECT_UPDATE,
        title: projectName,
        message: `${actorName} a décliné votre invitation`,
        metadata: { projectId, projectName, actorName },
      },
    );
  }

  async removedFromProject(
    userId: string,
    projectName: string,
    actorId: string,
  ): Promise<void> {
    const actor = await this.userRepository.findOneBy({ id: actorId });
    const actorName = actor ? this.fullName(actor) : 'Un administrateur';
    await this.send([userId], {
      type: NotificationType.SYSTEM,
      title: projectName,
      message: `${actorName} vous a retiré du projet « ${projectName} ».`,
      metadata: { projectName, actorName },
    });
  }

  async comparisonFinished(
    userId: string,
    projectId: string,
    comparisonId: string,
    succeeded: boolean,
  ): Promise<void> {
    await this.send([userId], {
      type: NotificationType.PROJECT_UPDATE,
      title: 'Comparaison IA',
      message: succeeded
        ? 'Votre comparaison de parcelles est prête'
        : 'Votre comparaison de parcelles n’a pas abouti',
      metadata: { projectId, comparisonId, tab: 'plots', actorName: '' },
    });
  }

  async feedbackReceived(title: string, authorName: string): Promise<void> {
    const admins = await this.userRepository.findBy({ isAdmin: true });
    await this.send(
      admins.map((admin) => admin.id),
      {
        type: NotificationType.SYSTEM,
        title: 'Nouveau retour utilisateur',
        message: `${authorName} : « ${title} »`,
        metadata: { feedbackReceived: true },
      },
    );
  }

  private fullName(user: User): string {
    return `${user.firstName} ${user.surName}`.trim();
  }

  private async send(
    userIds: string[],
    draft: NotificationDraft,
  ): Promise<void> {
    if (userIds.length === 0) return;
    try {
      await this.notificationRepository.save(
        userIds.map((userId) =>
          this.notificationRepository.create({ ...draft, userId }),
        ),
      );
    } catch (error) {
      this.logger.error(`Notification « ${draft.title} » impossible`, error);
    }
  }
}
