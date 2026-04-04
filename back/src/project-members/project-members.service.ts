import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProjectMember,
  ProjectMemberRole,
  ProjectMemberStatus,
} from '../database/project-member.entity';
import { Project } from '../database/project.entity';
import { User } from '../database/user.entity';
import {
  InviteMemberDto,
  UpdateMemberRoleDto,
  MemberResponseDto,
} from './dto/project-members.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../database/notification.entity';
import { ActivityHistoryService } from '../history/history.service';
import { ActivityEventType } from '../database/history.entity';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectRepository(ProjectMember)
    private memberRepository: Repository<ProjectMember>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
    private readonly activityHistoryService: ActivityHistoryService,
  ) {}

  private resolveUserDisplayName(user: User): string {
    return `${user.firstName} ${user.surName}`.trim() || user.email;
  }


  async invite(
    projectId: string,
    inviterId: string,
    dto: InviteMemberDto,
  ): Promise<MemberResponseDto> {
    // Vérifier que le projet existe
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${projectId} non trouvé`);
    }

    // Vérifier que l'inviteur est owner ou admin du projet
    await this.assertRole(projectId, inviterId, [
      ProjectMemberRole.OWNER,
      ProjectMemberRole.ADMIN,
    ]);

    // Trouver l'utilisateur invité par email
    const invitedUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!invitedUser) {
      throw new NotFoundException(
        `Aucun utilisateur trouvé avec l'email ${dto.email}`,
      );
    }

    // Empêcher de s'inviter soi-même
    if (invitedUser.id === inviterId) {
      throw new BadRequestException(
        'Vous ne pouvez pas vous inviter vous-même',
      );
    }

    // Empecher d'inviter quelqu'un qui est déjà membre ou invité (même en pending)
    const existing = await this.memberRepository.findOne({
      where: { projectId, userId: invitedUser.id },
    });
    if (existing) {
      throw new ConflictException(
        'Cet.te utilisateur.ice est déjà membre ou invité.e sur ce projet',
      );
    }

    // Empêcher d'assigner le rôle owner via invitation
    if (dto.role === ProjectMemberRole.OWNER) {
      throw new ForbiddenException(
        'Le rôle owner ne peut pas être attribué via invitation',
      );
    }

       const member = this.memberRepository.create({
      projectId,
      userId: invitedUser.id,
      role: dto.role ?? ProjectMemberRole.VIEWER,
      invitedBy: inviterId,
      status: ProjectMemberStatus.PENDING,
    });
 
    const saved = await this.memberRepository.save(member);
 
    const inviter = await this.userRepository.findOne({
      where: { id: inviterId },
    });
    const inviterName = inviter
      ? this.resolveUserDisplayName(inviter)
      : "Quelqu'un";
 

      await this.notificationService.createNotification(
      invitedUser.id,
      NotificationType.PROJECT_INVITATION,
      'Invitation à un projet',
      `${inviterName} vous invite à rejoindre le projet ${project.name}`,
      {
        inviterName,
        projectName: project.name,
        projectId: project.id,
        memberId: saved.id,
        inviterId,
      },
    );
 
    const existingMembers = await this.memberRepository.find({
      where: { projectId, status: ProjectMemberStatus.ACCEPTED },
    });
    const notifyIds = existingMembers
      .map((m) => m.userId)
      .filter((uid) => uid !== inviterId && uid !== invitedUser.id);
 
    await Promise.all(
      notifyIds.map((uid) =>
        this.notificationService.createNotification(
          uid,
          NotificationType.PROJECT_ACTIVITY,
          'Nouvel.le invité.e sur vos projets',
          `${inviterName} a invité un nouveau membre à rejoindre le projet : ${project.name}`,
          {
            inviterName,
            invitedEmail: invitedUser.email,
            projectName: project.name,
            projectId: project.id,
          },
        ),
      ),
    );
 
    // activity history 
    await this.activityHistoryService.record({
      projectId,
      actorUserId: inviterId,
      actorDisplayName: inviterName,
      eventType: ActivityEventType.MEMBER_INVITED,
      payload: {
        type: ActivityEventType.MEMBER_INVITED,
        invitedEmail: invitedUser.email,
        invitedUserId: invitedUser.id,
        role: saved.role,
        projectName: project.name,
      },
    });
 
    return this.toResponseDto(saved, invitedUser);
  }


  async getMembers(
    projectId: string,
    requesterId: string,
  ): Promise<MemberResponseDto[]> {
    // Vérifier que le requester a accès au projet
    await this.assertMember(projectId, requesterId);

    const members = await this.memberRepository.find({
      where: { projectId },
      relations: ['user'],
      order: { invitedAt: 'ASC' },
    });

    return members.map((m) => this.toResponseDto(m, m.user));
  }


  async updateRole(
    projectId: string,
    memberId: string,
    requesterId: string,
    dto: UpdateMemberRoleDto,
  ): Promise<MemberResponseDto> {
    // permission 
    await this.assertRole(projectId, requesterId, [
      ProjectMemberRole.OWNER,
      ProjectMemberRole.ADMIN,
    ]);

    const member = await this.memberRepository.findOne({
      where: { id: memberId, projectId },
      relations: ['user'],
    });
    if (!member) {
      throw new NotFoundException(
        `Membre avec l'ID ${memberId} non trouvé dans ce projet`,
      );
    }

    // Empêcher de modifier le rôle du owner
    if (member.role === ProjectMemberRole.OWNER) {
      throw new ForbiddenException(
        'Le rôle du propriétaire ne peut pas être modifié',
      );
    }

    // Empêcher de modifier son propre rôle
    if (member.userId === requesterId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas modifier votre propre rôle',
      );
    }

    // Empêcher d'attribuer owner
    if (dto.role === ProjectMemberRole.OWNER) {
      throw new ForbiddenException('Le rôle owner ne peut pas être attribué');
    }

    const previousRole = member.role;
    member.role = dto.role;
    const updated = await this.memberRepository.save(member);
 
    const requester = await this.userRepository.findOne({
      where: { id: requesterId },
    });
    const requesterName = requester
      ? this.resolveUserDisplayName(requester)
      : 'Unknown user';
    const targetDisplayName = member.user
      ? this.resolveUserDisplayName(member.user)
      : member.userId;
 
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });


    //activity history
    await this.activityHistoryService.record({
      projectId,
      actorUserId: requesterId,
      actorDisplayName: requesterName,
      eventType: ActivityEventType.MEMBER_ROLE_UPDATED,
      payload: {
        type: ActivityEventType.MEMBER_ROLE_UPDATED,
        targetUserId: member.userId,
        targetDisplayName,
        previousRole,
        newRole: dto.role,
        projectName: project?.name ?? projectId,
      },
    });
 
    return this.toResponseDto(updated, member.user);
  }


  async removeMember(
    projectId: string,
    memberId: string,
    requesterId: string,
  ): Promise<void> {
    //permission
    await this.assertRole(projectId, requesterId, [
      ProjectMemberRole.OWNER,
      ProjectMemberRole.ADMIN,
    ]);

    const member = await this.memberRepository.findOne({
      where: { id: memberId, projectId },
    });
    if (!member) {
      throw new NotFoundException(
        `Membre avec l'ID ${memberId} non trouvé dans ce projet`,
      );
    }

    // Empêcher de supprimer le owner
    if (member.role === ProjectMemberRole.OWNER) {
      throw new ForbiddenException(
        'Le propriétaire du projet ne peut pas être retiré',
      );
    }

    const removedUserId = member.userId;
    const removedDisplayName = member.user
      ? this.resolveUserDisplayName(member.user)
      : member.userId;
    const removedRole = member.role;
 
    await this.memberRepository.remove(member);
 
    const requester = await this.userRepository.findOne({
      where: { id: requesterId },
    });
    const requesterName = requester
      ? this.resolveUserDisplayName(requester)
      : 'Unknown user';
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
 
    // activity history
    await this.activityHistoryService.record({
      projectId,
      actorUserId: requesterId,
      actorDisplayName: requesterName,
      eventType: ActivityEventType.MEMBER_REMOVED,
      payload: {
        type: ActivityEventType.MEMBER_REMOVED,
        removedUserId,
        removedDisplayName,
        role: removedRole,
        projectName: project?.name ?? projectId,
      },
    });
  }
 

  async respondToInvitation(
    projectId: string,
    memberId: string,
    userId: string,
    accept: boolean,
  ): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId, projectId },
      relations: ['user'],
    });
    if (!member) {
      throw new NotFoundException(
        `Invitation avec l'ID ${memberId} non trouvée`,
      );
    }

    // Seul l'invité peut répondre
    if (member.userId !== userId) {
      throw new ForbiddenException(
        "Vous ne pouvez répondre qu'à vos propres invitations",
      );
    }

    if (member.status !== ProjectMemberStatus.PENDING) {
      throw new BadRequestException('Cette invitation a déjà reçu une réponse');
    }

    member.status = accept
      ? ProjectMemberStatus.ACCEPTED
      : ProjectMemberStatus.DECLINED;

    if (accept) {
      member.acceptedAt = new Date();
    }

    const updated = await this.memberRepository.save(member);

    // Récupérer le projet et l'invité pour les noms
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    const respondent = member.user;
    const respondentName = respondent
      ? `${respondent.firstName} ${respondent.surName}`.trim() ||
        respondent.email
      : 'Un utilisateur';

    // Envoyer une notification à l'inviteur (si existant)
    if (member.invitedBy) {
      await this.notificationService.createNotification(
        member.invitedBy,
        NotificationType.PROJECT_UPDATE,
        accept ? 'Invitation acceptée' : 'Invitation refusée',
        accept
          ? `${respondentName} a accepté de rejoindre le projet ${project?.name ?? 'votre projet'}`
          : `${respondentName} a refusé de rejoindre le projet ${project?.name ?? 'votre projet'}`,
        {
          userName: respondentName,
          projectName: project?.name ?? 'votre projet',
          projectId,
          accepted: accept,
        },
      );
    }

    // activity history
    await this.activityHistoryService.record({
      projectId,
      actorUserId: userId,
      actorDisplayName: respondentName,
      eventType: accept
        ? ActivityEventType.MEMBER_ACCEPTED
        : ActivityEventType.MEMBER_DECLINED,
      payload: {
        type: accept
          ? ActivityEventType.MEMBER_ACCEPTED
          : ActivityEventType.MEMBER_DECLINED,
        memberId,
        projectName: project?.name ?? projectId,
      },
    });

    return this.toResponseDto(updated, member.user);
  }


// verifie que le userId est membre du projet
  private async assertMember(
    projectId: string,
    userId: string,
  ): Promise<ProjectMember> {
    // Le propriétaire du projet (via projects.userId) a toujours accès
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (project && project.userId === userId) {
      // Retourner un membre virtuel owner
      const virtual = new ProjectMember();
      virtual.role = ProjectMemberRole.OWNER;
      virtual.userId = userId;
      virtual.projectId = projectId;
      return virtual;
    }

    const member = await this.memberRepository.findOne({
      where: { projectId, userId },
    });
    if (!member) {
      throw new ForbiddenException("Vous n'êtes pas membre de ce projet");
    }
    return member;
  }


// verifie que le userId a un des roles permis sur le projet
  private async assertRole(
    projectId: string,
    userId: string,
    allowedRoles: ProjectMemberRole[],
  ): Promise<void> {
    const member = await this.assertMember(projectId, userId);
    if (!allowedRoles.includes(member.role)) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits nécessaires pour cette action",
      );
    }
  }

  private toResponseDto(member: ProjectMember, user: User): MemberResponseDto {
    return {
      id: member.id,
      projectId: member.projectId,
      userId: member.userId,
      email: user.email,
      firstName: user.firstName,
      surName: user.surName,
      profilePicture: user.profilePicture,
      role: member.role,
      status: member.status,
      invitedBy: member.invitedBy,
      invitedAt: member.invitedAt,
      acceptedAt: member.acceptedAt,
    };
  }
}
