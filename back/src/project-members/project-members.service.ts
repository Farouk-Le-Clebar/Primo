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
  ) {}


  async invite(
    projectId: string,
    inviterId: string,
    dto: InviteMemberDto,
  ): Promise<MemberResponseDto> {
    // projet existe ?
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

    const invitedUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!invitedUser) {
      throw new NotFoundException(
        `Aucun utilisateur trouvé avec l'email ${dto.email}`,
      );
    }

    // empêcher de s'inviter soi-même
    if (invitedUser.id === inviterId) {
      throw new BadRequestException(
        'Vous ne pouvez pas vous inviter vous-même',
      );
    }

    // empecher d'inviter le meme
    const existing = await this.memberRepository.findOne({
      where: { projectId, userId: invitedUser.id },
    });
    if (existing) {
      throw new ConflictException(
        'Cet utilisateur est déjà membre ou invité sur ce projet',
      );
    }

  
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
      ? `${inviter.firstName} ${inviter.surName}`.trim() || inviter.email
      : "Quelqu'un";

    // Envoyer une notification d'invitation au membre invité
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

    // Notifier tous les autres membres existants (acceptés) du projet
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
          'Nouvel invité sur vos projets',
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

    return this.toResponseDto(saved, invitedUser);
  }


  async getMembers(
    projectId: string,
    requesterId: string,
  ): Promise<MemberResponseDto[]> {

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

    if (member.role === ProjectMemberRole.OWNER) {
      throw new ForbiddenException(
        'Le rôle du propriétaire ne peut pas être modifié',
      );
    }

    if (member.userId === requesterId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas modifier votre propre rôle',
      );
    }

    if (dto.role === ProjectMemberRole.OWNER) {
      throw new ForbiddenException('Le rôle owner ne peut pas être attribué');
    }

    member.role = dto.role;
    const updated = await this.memberRepository.save(member);

    return this.toResponseDto(updated, member.user);
  }


  async removeMember(
    projectId: string,
    memberId: string,
    requesterId: string,
  ): Promise<void> {

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

    if (member.role === ProjectMemberRole.OWNER) {
      throw new ForbiddenException(
        'Le propriétaire du projet ne peut pas être retiré',
      );
    }

    await this.memberRepository.remove(member);
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


    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    const respondent = member.user;
    const respondentName = respondent
      ? `${respondent.firstName} ${respondent.surName}`.trim() ||
        respondent.email
      : 'Un utilisateur';

    // Envoyer une notification à l'inviteur
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

    return this.toResponseDto(updated, member.user);
  }


  /**
   * vérifie que l'utilisateur est membre du projet 
   */
  private async assertMember(
    projectId: string,
    userId: string,
  ): Promise<ProjectMember> {

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (project && project.userId === userId) {
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

  /**
   * Vérifie que l'utilisateur a un rôle autorisé sur le projet.
   */
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
