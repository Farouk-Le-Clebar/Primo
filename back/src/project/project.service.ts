import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../database/project.entity';
import { 
  CreateProjectDto, 
  UpdateProjectDto, 
  ProjectResponseDto,
  UpdateNotesDto,
  UpdateFavoriteDto 
} from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto, 
    userId: string
  ): Promise<ProjectResponseDto> {
    try {
      const project = this.projectRepository.create({
        ...createProjectDto,
        userId,
        isFavorite: createProjectDto.isFavorite ?? false,
      });

      const savedProject = await this.projectRepository.save(project);
      return this.toResponseDto(savedProject);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la création du projet');
    }
  }

  async findAllByUser(userId: string): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepository.find({
      where: { userId },
      order: { modifiedAt: 'DESC' },
    });

    return projects.map(project => this.toResponseDto(project));
  }

  async findOne(id: string, userId: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à ce projet');
    }

    return this.toResponseDto(project);
  }

  async update(
    id: string, 
    updateProjectDto: UpdateProjectDto, 
    userId: string
  ): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à ce projet');
    }

    try {
      Object.assign(project, updateProjectDto);
      
      const updatedProject = await this.projectRepository.save(project);
      return this.toResponseDto(updatedProject);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la mise à jour du projet');
    }
  }

  async updateNotes(
    id: string, 
    updateNotesDto: UpdateNotesDto, 
    userId: string
  ): Promise<ProjectResponseDto> {
    return this.update(id, { notes: updateNotesDto.notes }, userId);
  }

  async updateFavorite(
    id: string, 
    updateFavoriteDto: UpdateFavoriteDto, 
    userId: string
  ): Promise<ProjectResponseDto> {
    return this.update(id, { isFavorite: updateFavoriteDto.isFavorite }, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à ce projet');
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

    return projects.map(project => this.toResponseDto(project));
  }

  async searchByName(
    searchTerm: string, 
    userId: string
  ): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.userId = :userId', { userId })
      .andWhere('LOWER(project.name) LIKE LOWER(:searchTerm)', { 
        searchTerm: `%${searchTerm}%` 
      })
      .orderBy('project.modifiedAt', 'DESC')
      .getMany();

    return projects.map(project => this.toResponseDto(project));
  }

  private toResponseDto(project: Project): ProjectResponseDto {
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
    };
  }
}