import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Projects } from 'src/database/project.entity';
import { AddPlotToProjectDto, CreateProjectDto, InviteUserDto } from './project.type';
import { ProjectPlots } from 'src/database/project-plots.entity';
import { ProjectMembers } from 'src/database/project-members.entity';
import { User } from 'src/database/user.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Projects)
        private projectsRepository: Repository<Projects>,
        @InjectRepository(ProjectPlots)
        private projectPlotsRepository: Repository<ProjectPlots>,
        @InjectRepository(ProjectMembers)
        private projectMembersRepository: Repository<ProjectMembers>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async createProject(createProjectDto: CreateProjectDto, userId: string) {
        let project = this.projectsRepository.create({
            name: createProjectDto.name,
            description: createProjectDto.description,
        });

        project = await this.projectsRepository.save(project);

        const member = await this.projectMembersRepository.create({
            userId: userId,
            projectId: project.id,
            isAdmin: true,
            role: 'admin',
        });

        await this.projectMembersRepository.save(member);
    }

    async getProjects(userId: string) {
        const projectMembers = await this.projectMembersRepository.find({
            where: { userId: userId },
            order: { isFavorite: "DESC" },
        });

        if (projectMembers.length === 0)
            return [];

        const projectIds = projectMembers.map(member => member.projectId);

        const projects = await this.projectsRepository.find({
            where: { id: In(projectIds) },
        });

        const projectsMap = new Map(projects.map(p => [p.id, p]));

        const sortedProjects: any[] = [];
        for (const member of projectMembers) {
            const project = projectsMap.get(member.projectId);
            if (project) {
                project['isFavorite'] = member.isFavorite;
                sortedProjects.push(project);
            }
        }

        return sortedProjects;
    }

    async getProjectById(projectId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
        });

        if (!isMember)
            throw new UnauthorizedException('Project not found or does not belong to the user');

        return project;
    }

    async deleteProject(projectId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const isAdmin = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
            isAdmin: true,
        });

        if (!isAdmin)
            throw new UnauthorizedException('Project not found or does not belong to the user');

        await this.projectsRepository.delete({ id: projectId });
        await this.projectMembersRepository.delete({ projectId: projectId });
        await this.projectPlotsRepository.delete({ projectId: projectId });
    }


    async addPlotToProject(addPlotToProjectDto: AddPlotToProjectDto, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: addPlotToProjectDto.projectId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: addPlotToProjectDto.projectId,
            userId: userId,
        });

        if (!isMember)
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
        const project = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
        });

        if (!isMember)
            throw new UnauthorizedException('Project does not belong to the user');

        project.isFavorite = !project.isFavorite;
        await this.projectMembersRepository.save(project);
    }

    async getPlotsOfProject(projectId: string, userId: string) {
        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
        });

        if (!isMember)
            throw new UnauthorizedException('Project does not belong to the user');

        const project = await this.projectsRepository.findOneBy({
            id: projectId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const plots = await this.projectPlotsRepository.find({
            where: { projectId: projectId },
        });

        return plots;
    }

    async inviteUserToProject(inviteUserDto: InviteUserDto, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: inviteUserDto.projectId,
        });

        if (!project)
            throw new NotFoundException('Projet introuvable. Réessayez plus tard.');

        const isInviterMember = await this.projectMembersRepository.findOneBy({
            projectId: inviteUserDto.projectId,
            userId: userId,
        });

        if (!isInviterMember)
            throw new UnauthorizedException('Vous n\'avez pas les droits pour inviter des membres à ce projet.');

        const newMember = await this.usersRepository.findOneBy({
            email: inviteUserDto.email,
        });

        if (!newMember)
            throw new NotFoundException('Utilisateur introuvable.');

        const isAlreadyMember = await this.projectMembersRepository.findOneBy({
            projectId: inviteUserDto.projectId,
            userId: newMember.id,
        });

        if (isAlreadyMember)
            throw new UnauthorizedException('Cet utilisateur est déjà membre du projet.');

        const projectMember = this.projectMembersRepository.create({
            projectId: inviteUserDto.projectId,
            userId: newMember.id,
            role: "member",
            isAdmin: false,
        });

        await this.projectMembersRepository.save(projectMember);

        project.numberOfMembers += 1;
        await this.projectsRepository.save(project);
    }

    async getProjectMembers(projectId: string, userId: string) {
        const members = await this.projectMembersRepository.find({
            where: { projectId: projectId },
            order: { isAdmin: "DESC", joinedAt: "ASC" },
        });

        for (const member of members) {
            const user = await this.usersRepository.findOneBy({ id: member.userId });
            if (!user)
                continue;
            member['user'] = {
                firstName: user.firstName,
                surName: user.surName,
                email: user.email,
                profilePicture: user.profilePicture,
            };
        }

        for (const member of members) {
            if (member.userId === userId) {
                member['isCurrentUser'] = true;
            } else {
                member['isCurrentUser'] = false;
            }
            delete (member as any).userId;
            delete (member as any).projectId;
            delete (member as any).isFavorite;
        }

        return members;
    }

    async deletePlotFromProject(id: string, userId: string) {
        const projectPlot = await this.projectPlotsRepository.findOneBy({
            id: id,
        });

        if (!projectPlot)
            throw new NotFoundException('Plot not found or does not belong to the user');

        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: projectPlot.projectId,
            userId: userId,
        });

        if (!isMember)
            throw new UnauthorizedException('Project does not belong to the user');

        await this.projectPlotsRepository.delete({ id: id });

        const project = await this.projectsRepository.findOneBy({
            id: projectPlot.projectId,
        });

        if (project) {
            project.numberOfPlots -= 1;
            await this.projectsRepository.save(project);
        }
    }

    async removeMemberFromProject(projectId: string, memberId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
        });

        if (!project)
            throw new NotFoundException('Projet introuvable. Réessayez plus tard.');

        const isAdmin = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
            isAdmin: true,
        });

        if (!isAdmin)
            throw new UnauthorizedException('Vous n\'avez pas les permissions pour supprimer des membres de ce projet.');

        const memberToRemove = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            id: memberId,
        });

        if (!memberToRemove)
            throw new NotFoundException('Membre introuvable.');

        await this.projectMembersRepository.delete({ id: memberToRemove.id });
        project.numberOfMembers -= 1;
        await this.projectsRepository.save(project);
    }
}
