import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import type { AddPlotToProjectDto, CreateProjectDto, InviteUserDto } from './project.type';
import { AddDocumentToProjectDto } from './project.type';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { ProjectGuard } from 'src/guard/project.guard';

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

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Get(":projectId")
    async getProjectById(@Req() req, @Param("projectId") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.getProjectById(projectId, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Delete(":projectId")
    async deleteProject(@Req() req, @Param("projectId") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.deleteProject(projectId, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Post("plot")
    async addPlotToProject(@Body() addPlotToProjectDto: AddPlotToProjectDto, @Req() req) {
        const userId = req.user.id;
        return this.projectsService.addPlotToProject(addPlotToProjectDto, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Delete("plot/:plotId")
    async deletePlotFromProject(@Req() req, @Param("plotId") plotId: string) {
        const userId = req.user.id;
        return this.projectsService.deletePlotFromProject(plotId, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Get(":projectId/plots")
    async getPlotsOfProject(@Req() req, @Param("projectId") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.getPlotsOfProject(projectId, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Put(":projectId/favorite")
    async toggleFavorite(@Req() req, @Param("projectId") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.toggleFavorite(projectId, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Post("/invite")
    async inviteUserToProject(@Body() inviteUserDto: InviteUserDto, @Req() req) {
        const userId = req.user.id;
        return this.projectsService.inviteUserToProject(inviteUserDto, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Get(":projectId/members")
    async getProjectMembers(@Req() req, @Param("projectId") projectId: string) {
        const userId = req.user.id;
        return this.projectsService.getProjectMembers(projectId, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Delete(":projectId/members/:memberId")
    async removeMemberFromProject(@Req() req, @Param("projectId") projectId: string, @Param("memberId") memberId: string) {
        const userId = req.user.id;
        return this.projectsService.removeMemberFromProject(projectId, memberId, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Post("documents/upload")
    @UseInterceptors(FileInterceptor('document'))
    async addDocumentToProject(
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: AddDocumentToProjectDto
    ) {
        return this.projectsService.addDocumentToProject(body, file);
    }
}
