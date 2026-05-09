import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Projects } from 'src/database/project.entity';
import { AddPlotToProjectDto, CreateProjectDto } from './project.type';
import { ProjectPlots } from 'src/database/project-plots.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Projects)
        private projectsRepository: Repository<Projects>,
        @InjectRepository(ProjectPlots)
        private projectPlotsRepository: Repository<ProjectPlots>,
    ) { }

    async createProject(createProjectDto: CreateProjectDto, userId: string) {
        const project = this.projectsRepository.create({
            name: createProjectDto.name,
            userId: userId,
            description: createProjectDto.description,
        });
        await this.projectsRepository.save(project);
    }

    async getProjects(userId: string) {
        const projects = await this.projectsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });

        return projects.map(project => {
            const { userId, ...rest } = project;
            return rest;
        });
    }

    async getProjectById(projectId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
            userId: userId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        if (project.userId !== userId)
            throw new UnauthorizedException('Project does not belong to the user');

        const { userId: _, ...rest } = project;
        return rest;
    }

    async deleteProject(projectId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
            userId: userId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        if (project.userId !== userId)
            throw new UnauthorizedException('Project does not belong to the user');

        await this.projectPlotsRepository.delete({ projectId: projectId });
        await this.projectsRepository.delete({ id: projectId });
    }

    async addPlotToProject(addPlotToProjectDto: AddPlotToProjectDto, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: addPlotToProjectDto.projectId,
            userId: userId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        if (project.userId !== userId)
            throw new UnauthorizedException('Project does not belong to the user');

        const projectPlot = this.projectPlotsRepository.create({
            projectId: addPlotToProjectDto.projectId,
            plotId: addPlotToProjectDto.plotId,
            plotBanId: addPlotToProjectDto.plotBanId,
            coordinates: addPlotToProjectDto.coordinates,
            adress: addPlotToProjectDto.adress,
            geometry: addPlotToProjectDto.geometry,
        });

        const response = await this.projectPlotsRepository.save(projectPlot);

        if (response) {
            project.numberOfPlots += 1;
            await this.projectsRepository.save(project);
        }
    }

    async toggleFavorite(projectId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
            userId: userId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        if (project.userId !== userId)
            throw new UnauthorizedException('Project does not belong to the user');

        project.isFavorite = !project.isFavorite;
        await this.projectsRepository.save(project);
    }

    async getPlotsOfProject(projectId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
            userId: userId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        if (project.userId !== userId)
            throw new UnauthorizedException('Project does not belong to the user');

        const plots = await this.projectPlotsRepository.find({
            where: { projectId: projectId },
        });

        return plots;
    }
}
