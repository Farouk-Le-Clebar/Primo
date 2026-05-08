import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import type { AddPlotToProjectDto, CreateProjectDto } from './project.type';

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
    @Post("plot")
    async addPlotToProject(@Body() addPlotToProjectDto: AddPlotToProjectDto, @Req() req) {
        const userId = req.user.id;
        return this.projectsService.addPlotToProject(addPlotToProjectDto, userId);
    }
}
