import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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
  AddPlotDto,
} from './dto/project.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../database/notification.entity';
import { ActivityHistoryService } from '../history/history.service';
import { ActivityEventType } from '../database/history.entity';
import { ProjectPlots } from 'src/database/project-plots.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private memberRepository: Repository<ProjectMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProjectPlots)
    private projectPlotsRepository: Repository<ProjectPlots>,
    private readonly notificationService: NotificationService,
    private readonly activityHistoryService: ActivityHistoryService,
  ) { }

  private async resolveDisplayName(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return 'Unknown user';
    return `${user.firstName} ${user.surName}`.trim() || user.email;
  }

  private parseRawCount(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  private mapProjectsWithSqlCount(
    projects: Project[],
    rawRows: Record<string, unknown>[],
  ): ProjectResponseDto[] {
    return projects.map((project, index) => {
      const raw = rawRows[index] ?? {};
      const memberCount = this.parseRawCount(raw.memberCount);
      return this.toResponseDto(project, memberCount);
    });
  }

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

      // Enregistrer l'événement d'activité
      const actorDisplayName = await this.resolveDisplayName(userId);
      await this.activityHistoryService.record({
        projectId: savedProject.id,
        actorUserId: userId,
        actorDisplayName,
        eventType: ActivityEventType.PROJECT_CREATED,
        payload: {
          type: ActivityEventType.PROJECT_CREATED,
          projectName: savedProject.name,
        },
      });

      const projectWithMembers = await this.projectRepository.findOne({
        where: { id: savedProject.id },
        relations: ['members'],
      });

      return this.toResponseDto(projectWithMembers ?? savedProject);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la création du projet');
    }
  }

  async findAllByUser(userId: string): Promise<ProjectResponseDto[]> {
    const qb = this.projectRepository
      .createQueryBuilder('project')
      .leftJoin(
        ProjectMember,
        'access',
        'access.projectId = project.id AND access.userId = :userId AND access.status = :acceptedStatus',
        {
          userId,
          acceptedStatus: ProjectMemberStatus.ACCEPTED,
        },
      )
      .where(
        new Brackets((subQb) => {
          subQb
            .where('project.userId = :userId', { userId })
            .orWhere('access.id IS NOT NULL');
        }),
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(pm.id)', 'count')
            .from(ProjectMember, 'pm')
            .where('pm.projectId = project.id')
            .andWhere('pm.status = :countAcceptedStatus', {
              countAcceptedStatus: ProjectMemberStatus.ACCEPTED,
            }),
        'memberCount',
      )
      .orderBy('project.modifiedAt', 'DESC');

    const { entities, raw } = await qb.getRawAndEntities();
    return this.mapProjectsWithSqlCount(entities, raw);
  }

  async findOne(id: string, userId: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    // accès si propriétaire OU membre accepté
    if (project.userId !== userId) {
      const membership = await this.memberRepository.findOne({
        where: { projectId: id, userId, status: ProjectMemberStatus.ACCEPTED },
      });
      if (!membership) {
        throw new ForbiddenException('Accès non autorisé à ce projet');
      }
    }

    return this.toResponseDto(project);
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

    // Vérifier que l'utilisateur a le droit d'écriture (owner/admin/editor)
    await this.assertWriteAccess(id, userId);

    try {
      const changedFields = Object.keys(updateProjectDto).filter(
        (key) =>
          (updateProjectDto as Record<string, any>)[key] !==
          (project as Record<string, any>)[key],
      );

      Object.assign(project, updateProjectDto);

      const updatedProject = await this.projectRepository.save(project);

      const updatedProjectWithMembers = await this.projectRepository.findOne({
        where: { id: updatedProject.id },
        relations: ['members'],
      });

      // //activity history mais useless pour l'instant ça fait des duplicata
      // if (changedFields.length > 0) {
      //   const actorName = await this.resolveDisplayName(userId);
      //   await this.activityHistoryService.record({
      //     projectId: updatedProject.id,
      //     actorUserId: userId,
      //     actorDisplayName: actorName,
      //     eventType: ActivityEventType.PROJECT_UPDATED,
      //     payload: {
      //       type: ActivityEventType.PROJECT_UPDATED,
      //       projectName: updatedProject.name,
      //       changedFields,
      //     },
      //   });
      // }

      return this.toResponseDto(updatedProjectWithMembers ?? updatedProject);
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

    await this.activityHistoryService.record({
      projectId: id,
      actorUserId: userId,
      actorDisplayName: editorName,
      eventType: ActivityEventType.PROJECT_NOTES_UPDATED,
      payload: {
        type: ActivityEventType.PROJECT_NOTES_UPDATED,
        projectName: project?.name ?? 'votre projet',
      },
    });

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

    // seul le propriétaire (owner) peut supprimer le projet // a voir si on veut pas faire un systeme de demande pour ceux qui sont pas owner -> stp sort moi du projet.
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
    const qb = this.projectRepository
      .createQueryBuilder('project')
      .where('project.userId = :userId', { userId })
      .andWhere('project.isFavorite = :isFavorite', { isFavorite: true })
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(pm.id)', 'count')
            .from(ProjectMember, 'pm')
            .where('pm.projectId = project.id')
            .andWhere('pm.status = :countAcceptedStatus', {
              countAcceptedStatus: ProjectMemberStatus.ACCEPTED,
            }),
        'memberCount',
      )
      .orderBy('project.modifiedAt', 'DESC');

    const { entities, raw } = await qb.getRawAndEntities();
    return this.mapProjectsWithSqlCount(entities, raw);
  }

  async searchByName(
    searchTerm: string,
    userId: string,
  ): Promise<ProjectResponseDto[]> {
    const qb = this.projectRepository
      .createQueryBuilder('project')
      .where('project.userId = :userId', { userId })
      .andWhere('LOWER(project.name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(pm.id)', 'count')
            .from(ProjectMember, 'pm')
            .where('pm.projectId = project.id')
            .andWhere('pm.status = :countAcceptedStatus', {
              countAcceptedStatus: ProjectMemberStatus.ACCEPTED,
            }),
        'memberCount',
      )
      .orderBy('project.modifiedAt', 'DESC');

    const { entities, raw } = await qb.getRawAndEntities();
    return this.mapProjectsWithSqlCount(entities, raw);
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
      ProjectMemberRole.EDITOR,
    ];

    if (!writeRoles.includes(member.role)) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits nécessaires pour modifier ce projet",
      );
    }
  }

  private toResponseDto(
    project: Project,
    memberCountOverride?: number,
  ): ProjectResponseDto {
    const relationMemberCount = project.members
      ? project.members.filter(
        (member) => member.status === ProjectMemberStatus.ACCEPTED,
      ).length
      : 0;

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
      memberCount: memberCountOverride ?? relationMemberCount,
    };
  }

  async addPlotToProject(addPlotDto: AddPlotDto, userId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: addPlotDto.projectId },
    });

    if (!project)
      throw new NotFoundException(`Projet avec l'ID ${addPlotDto.projectId} non trouvé`);

    if (project.userId !== userId)
      throw new ForbiddenException('Accès non autorisé à ce projet');

    const projectPlot = this.projectPlotsRepository.insert({
      projectId: addPlotDto.projectId,
      plotId: addPlotDto.plotId,
      plotBanId: addPlotDto.plotBanId,
      adress: addPlotDto.adress,
    });

    if (!projectPlot)
      throw new BadRequestException('Erreur lors de l\'ajout du plot au projet');
  }

  async getPlotsByProject(projectId: string, userId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project)
      throw new NotFoundException(`Project not found`);

    if (project.userId !== userId)
      throw new ForbiddenException('Access to this project is forbidden');

    const plots = await this.projectPlotsRepository.find({
      where: { projectId },
    });

    return plots;
  }

  async getPlotsCountByProject(projectId: string, userId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project)
      throw new NotFoundException(`Project not found`);

    if (project.userId !== userId)
      throw new ForbiddenException('Access to this project is forbidden');

    const count = await this.projectPlotsRepository.count({
      where: { projectId },
    });

    return { count };
  }
}
