import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { User } from 'src/database/user.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ProjectGuard } from 'src/guard/project.guard';
import { CreateMilestoneDto, UpdateMilestoneDto } from './milestone.dto';
import { MilestoneResponse, MilestonesService } from './milestones.service';

interface RequestWithUser extends Request {
  user: User;
}

@UseGuards(JwtAuthGuard, ProjectGuard)
@Controller('projects/:projectId/milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get()
  async getMilestones(
    @Param('projectId') projectId: string,
  ): Promise<MilestoneResponse[]> {
    return this.milestonesService.getMilestones(projectId);
  }

  @Post()
  async createMilestone(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Body() dto: CreateMilestoneDto,
  ): Promise<MilestoneResponse> {
    return this.milestonesService.createMilestone(projectId, dto, req.user.id);
  }

  @Patch(':milestoneId')
  async updateMilestone(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
    @Body() dto: UpdateMilestoneDto,
  ): Promise<MilestoneResponse> {
    return this.milestonesService.updateMilestone(
      projectId,
      milestoneId,
      dto,
      req.user.id,
    );
  }

  @Delete(':milestoneId')
  async deleteMilestone(
    @Param('projectId') projectId: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
  ): Promise<void> {
    return this.milestonesService.deleteMilestone(projectId, milestoneId);
  }
}
