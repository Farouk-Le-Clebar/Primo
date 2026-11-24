import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../database/notification.entity';
import { User } from '../database/user.entity';
import { ProjectMembers } from '../database/project-members.entity';
import { Projects } from '../database/project.entity';

export type ProjectActivityKind = 'plot' | 'note' | 'document' | 'member' | 'milestone';

export type ProjectActivityPayload = Record<string, unknown>;

const ACTIVITY_MESSAGES: Record<ProjectActivityKind, string> = {
  plot: 'a ajouté une parcelle',
  note: 'a écrit une note',
  document: 'a déposé un document',
  member: 'a rejoint le projet',
  milestone: 'a validé un jalon',
};

@Injectable()
export class ProjectActivityNotifier {
  private readonly logger = new Logger(ProjectActivityNotifier.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProjectMembers)
    private membersRepository: Repository<ProjectMembers>,
    @InjectRepository(Projects)
    private projectsRepository: Repository<Projects>,
  ) {}

  async notify(projectId: string, actorId: string, kind: ProjectActivityKind, payload: ProjectActivityPayload = {}): Promise<void> {
    try {
      const [project, actor, members] = await Promise.all([
        this.projectsRepository.findOneBy({ id: projectId }),
        this.userRepository.findOneBy({ id: actorId }),
        this.membersRepository.findBy({ projectId, isPending: false }),
      ]);
      const recipients = members.filter((member) => member.userId !== actorId);
      if (!project || !actor || recipients.length === 0) return;

      const actorName = `${actor.firstName} ${actor.surName}`.trim();
      const notifications = recipients.map((member) =>
        this.notificationRepository.create({
          userId: member.userId,
          type: NotificationType.PROJECT_ACTIVITY,
          title: project.name,
          message: `${actorName} ${ACTIVITY_MESSAGES[kind]}`,
          metadata: { ...payload, kind, projectId, projectName: project.name, actorName },
        }),
      );
      await this.notificationRepository.save(notifications);
    } catch (error) {
      this.logger.error(`Notification d'activité ${kind} impossible pour le projet ${projectId}`, error);
    }
  }
}
