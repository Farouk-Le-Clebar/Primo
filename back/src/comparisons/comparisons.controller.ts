import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ProjectGuard } from 'src/guard/project.guard';
import { ComparisonsService } from './comparisons.service';
import { CreateComparisonDto } from './comparison.dto';

@Controller('projects/:projectId/comparisons')
@UseGuards(JwtAuthGuard, ProjectGuard)
export class ComparisonsController {
    constructor(private readonly comparisonsService: ComparisonsService) { }

    @Post()
    async create(@Req() req, @Param('projectId') projectId: string, @Body() body: CreateComparisonDto) {
        return this.comparisonsService.create(projectId, body, req.user.id);
    }

    @Get()
    async list(@Param('projectId') projectId: string) {
        return this.comparisonsService.list(projectId);
    }

    @Get(':comparisonId')
    async getOne(@Param('projectId') projectId: string, @Param('comparisonId') comparisonId: string) {
        return this.comparisonsService.getOne(projectId, comparisonId);
    }

    @Delete(':comparisonId')
    async remove(@Param('projectId') projectId: string, @Param('comparisonId') comparisonId: string) {
        return this.comparisonsService.remove(projectId, comparisonId);
    }
}
