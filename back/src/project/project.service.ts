import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../database/project.entity';
import {
  ProjectMember,
  ProjectMemberRole,
  ProjectMemberStatus,
} from '../database/project-member.entity';
import { User } from '../database/user.entity';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
  UpdateNotesDto,
  UpdateFavoriteDto,
} from './dto/project.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../database/notification.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private memberRepository: Repository<ProjectMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<ProjectResponseDto> {
    try {
      const project = this.projectRepository.create({
        ...createProjectDto,
        userId,
        isFavorite: createProjectDto.isFavorite ?? false,
      });

      const savedProject = await this.projectRepository.save(project);

      // Créer automatiquement le membership owner pour le créateur
      const ownerMember = this.memberRepository.create({
        projectId: savedProject.id,
        userId,
        role: ProjectMemberRole.OWNER,
        status: ProjectMemberStatus.ACCEPTED,
        invitedBy: null,
        acceptedAt: new Date(),
      });
      await this.memberRepository.save(ownerMember);

      return await this.toResponseDto(savedProject);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la création du projet');
    }
  }

  async findAllByUser(userId: string): Promise<ProjectResponseDto[]> {
    // Projets dont l'utilisateur est propriétaire
    const ownProjects = await this.projectRepository.find({
      where: { userId },
      order: { modifiedAt: 'DESC' },
    });

    // Projets partagés (invitation acceptée)
    const memberships = await this.memberRepository.find({
      where: { userId, status: ProjectMemberStatus.ACCEPTED },
      relations: ['project'],
    });

    const sharedProjects = memberships.map((m) => m.project).filter((p) => !!p);

    // Fusionner, dédupliquer, trier par date de modification décroissante
    const allMap = new Map<string, Project>();
    for (const p of ownProjects) allMap.set(p.id, p);
    for (const p of sharedProjects) {
      if (!allMap.has(p.id)) allMap.set(p.id, p);
    }

    const all = Array.from(allMap.values()).sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
    );

    return Promise.all(all.map((project) => this.toResponseDto(project)));
  }

  async findOne(id: string, userId: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    // Accès si propriétaire OU membre accepté
    if (project.userId !== userId) {
      const membership = await this.memberRepository.findOne({
        where: { projectId: id, userId, status: ProjectMemberStatus.ACCEPTED },
      });
      if (!membership) {
        throw new ForbiddenException('Accès non autorisé à ce projet');
      }
    }

    return await this.toResponseDto(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    // Vérifier que l'utilisateur a le droit d'écriture (owner/admin & co-admin/editor)
    await this.assertWriteAccess(id, userId);

    try {
      Object.assign(project, updateProjectDto);

      const updatedProject = await this.projectRepository.save(project);
      return await this.toResponseDto(updatedProject);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la mise à jour du projet');
    }
  }

  async updateNotes(
    id: string,
    updateNotesDto: UpdateNotesDto,
    userId: string,
  ): Promise<ProjectResponseDto> {
    const result = await this.update(
      id,
      { notes: updateNotesDto.notes },
      userId,
    );

    // Notifier les autres membres du projet
    const project = await this.projectRepository.findOne({ where: { id } });
    const editor = await this.userRepository.findOne({ where: { id: userId } });
    const editorName = editor
      ? `${editor.firstName} ${editor.surName}`.trim() || editor.email
      : 'Un membre';

    const members = await this.memberRepository.find({
      where: { projectId: id, status: ProjectMemberStatus.ACCEPTED },
    });

    const notifyIds = members
      .map((m) => m.userId)
      .filter((uid) => uid !== userId);

    await Promise.all(
      notifyIds.map((uid) =>
        this.notificationService.createNotification(
          uid,
          NotificationType.PROJECT_ACTIVITY,
          'Notes modifiées',
          `${editorName} a modifié les notes du projet : ${project?.name ?? 'votre projet'}`,
          {
            editorName,
            projectName: project?.name ?? 'votre projet',
            projectId: id,
          },
        ),
      ),
    );

    return result;
  }

  async updateFavorite(
    id: string,
    updateFavoriteDto: UpdateFavoriteDto,
    userId: string,
  ): Promise<ProjectResponseDto> {
    return this.update(
      id,
      { isFavorite: updateFavoriteDto.isFavorite },
      userId,
    );
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    // Seul le propriétaire (owner) peut supprimer le projet
    const member = await this.memberRepository.findOne({
      where: {
        projectId: id,
        userId,
        status: ProjectMemberStatus.ACCEPTED,
        role: ProjectMemberRole.OWNER,
      },
    });
    if (!member) {
      throw new ForbiddenException(
        'Seul le propriétaire peut supprimer ce projet',
      );
    }

    try {
      await this.projectRepository.remove(project);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la suppression du projet');
    }
  }

  async findFavoritesByUser(userId: string): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepository.find({
      where: { userId, isFavorite: true },
      order: { modifiedAt: 'DESC' },
    });

    return Promise.all(projects.map((project) => this.toResponseDto(project)));
  }

  async searchByName(
    searchTerm: string,
    userId: string,
  ): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.userId = :userId', { userId })
      .andWhere('LOWER(project.name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('project.modifiedAt', 'DESC')
      .getMany();

    return Promise.all(projects.map((project) => this.toResponseDto(project)));
  }

  /**
   * Vérifie que l'utilisateur a un accès en écriture sur le projet.
   * Rôles autorisés : owner, admin, co-admin, editor.
   */
  private async assertWriteAccess(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: {
        projectId,
        userId,
        status: ProjectMemberStatus.ACCEPTED,
      },
    });

    if (!member) {
      throw new ForbiddenException('Accès non autorisé à ce projet');
    }

    const writeRoles: ProjectMemberRole[] = [
      ProjectMemberRole.OWNER,
      ProjectMemberRole.ADMIN,
      ProjectMemberRole.CO_ADMIN,
      ProjectMemberRole.EDITOR,
    ];

    if (!writeRoles.includes(member.role)) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits nécessaires pour modifier ce projet",
      );
    }
  }

  private async toResponseDto(project: Project): Promise<ProjectResponseDto> {
    const memberCount = await this.memberRepository.count({
      where: {
        projectId: project.id,
        status: ProjectMemberStatus.ACCEPTED,
      },
    });

    return {
      id: project.id,
      name: project.name,
      isFavorite: project.isFavorite,
      notes: project.notes,
      parcels: project.parcels,
      parameters: project.parameters,
      userId: project.userId,
      createdAt: project.createdAt,
      modifiedAt: project.modifiedAt,
      memberCount,
    };
  }
}
