import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import type { AddPlotToProjectDto, CreateProjectDto, InviteUserDto } from './project.type';

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createProject(@Body() createProjectDto: CreateProjectDto, @Req() req) {
        const userId = req.user.id;
        return this.projectsService.createProject(createProjectDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getProjects(@Req() req) {
        const userId = req.user.id;
        return this.projectsService.getProjects(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getProjectById(@Req() req, @Param("id") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.getProjectById(projectId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteProject(@Req() req, @Param("id") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.deleteProject(projectId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post("plot")
    async addPlotToProject(@Body() addPlotToProjectDto: AddPlotToProjectDto, @Req() req) {
        const userId = req.user.id;
        return this.projectsService.addPlotToProject(addPlotToProjectDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("plot/:id")
    async deletePlotFromProject(@Req() req, @Param("id") plotId: string) {
        const userId = req.user.id;
        return this.projectsService.deletePlotFromProject(plotId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id/plots")
    async getPlotsOfProject(@Req() req, @Param("id") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.getPlotsOfProject(projectId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id/favorite")
    async toggleFavorite(@Req() req, @Param("id") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.toggleFavorite(projectId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/invite")
    async inviteUserToProject(@Body() inviteUserDto: InviteUserDto, @Req() req) {
        const userId = req.user.id;
        return this.projectsService.inviteUserToProject(inviteUserDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id/members")
    async getProjectMembers(@Req() req, @Param("id") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.getProjectMembers(projectId, userId);
    }
}
