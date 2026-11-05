import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import type { AddPlotToProjectDto, CreateProjectDto } from './project.type';
import { InvitationTokenDto, InviteUserDto, RequestDocumentUploadDto, RespondInvitationByTokenDto, RespondInvitationDto } from './project.type';
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

    // Declared before ":projectId" so "storage" is not captured as a project id.
    @UseGuards(JwtAuthGuard)
    @Get("storage")
    async getStorageUsage(@Req() req) {
        const userId = req.user.id;
        return this.projectsService.getStorageUsage(userId);
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

    // Public routes: the token received by e-mail is the credential (same model as /mail/verify).
    @Post("invitation/verify")
    async getInvitation(@Body() body: InvitationTokenDto) {
        return this.projectsService.getInvitationByToken(body.token);
    }

    @Post("invitation/respond")
    async respondToInvitationByToken(@Body() body: RespondInvitationByTokenDto) {
        return this.projectsService.respondToInvitationByToken(body.token, body.accept);
    }

    // No ProjectGuard: a pending member has no access to the project until the invitation is accepted.
    @UseGuards(JwtAuthGuard)
    @Patch(":projectId/members/:memberId/respond")
    async respondToInvitation(@Req() req, @Param("projectId") projectId: string, @Param("memberId") memberId: string, @Body() body: RespondInvitationDto) {
        return this.projectsService.respondToInvitation(projectId, memberId, req.user.id, body.accept);
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
    @Get(":projectId/documents")
    async getDocumentsOfProject(@Param("projectId") projectId: string) {
        return this.projectsService.getDocumentsOfProject(projectId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Post(":projectId/documents/upload-url")
    async requestDocumentUpload(@Req() req, @Param("projectId") projectId: string, @Body() body: RequestDocumentUploadDto) {
        const userId = req.user.id;
        return this.projectsService.requestDocumentUpload(projectId, body, userId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Post(":projectId/documents/:documentId/confirm")
    async confirmDocumentUpload(@Param("projectId") projectId: string, @Param("documentId") documentId: string) {
        return this.projectsService.confirmDocumentUpload(projectId, documentId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Get(":projectId/documents/:documentId/download")
    async getDocumentDownloadUrl(@Param("projectId") projectId: string, @Param("documentId") documentId: string) {
        return this.projectsService.getDocumentDownloadUrl(projectId, documentId);
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Get(":projectId/documents/:documentId/view")
    async getDocumentViewUrl(@Param("projectId") projectId: string, @Param("documentId") documentId: string) {
        return this.projectsService.getDocumentDownloadUrl(projectId, documentId, 'inline');
    }

    @UseGuards(JwtAuthGuard, ProjectGuard)
    @Delete(":projectId/documents/:documentId")
    async deleteDocumentFromProject(@Param("projectId") projectId: string, @Param("documentId") documentId: string) {
        return this.projectsService.deleteDocumentFromProject(projectId, documentId);
    }
}
