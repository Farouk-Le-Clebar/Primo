import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ProjectGuard } from 'src/guard/project.guard';
import { ProjectAddress } from 'src/database/project-address.entity';
import { ProjectAddressesService } from './project-addresses.service';
import { CreateProjectAddressDto } from './project-address.dto';
import { User } from 'src/database/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('projects/:projectId/addresses')
@UseGuards(JwtAuthGuard, ProjectGuard)
export class ProjectAddressesController {
  constructor(
    private readonly projectAddressesService: ProjectAddressesService,
  ) {}

  @Get()
  async getAddressesOfProject(
    @Param('projectId') projectId: string,
  ): Promise<ProjectAddress[]> {
    return this.projectAddressesService.getAddressesOfProject(projectId);
  }

  @Post()
  async addAddressToProject(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Body() body: CreateProjectAddressDto,
  ): Promise<ProjectAddress> {
    const userId = req.user.id;
    return this.projectAddressesService.addAddressToProject(
      projectId,
      body,
      userId,
    );
  }

  @Delete(':addressId')
  async deleteAddressFromProject(
    @Param('projectId') projectId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
  ): Promise<void> {
    return this.projectAddressesService.deleteAddressFromProject(
      projectId,
      addressId,
    );
  }
}
