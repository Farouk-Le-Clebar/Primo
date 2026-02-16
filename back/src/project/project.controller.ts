import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
  UpdateNotesDto,
  UpdateFavoriteDto,
} from './dto/project.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: any,
  ): Promise<ProjectResponseDto> {
    return this.projectService.create(createProjectDto, req.user.id);
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query('favorites') favorites?: string,
    @Query('search') search?: string,
  ): Promise<ProjectResponseDto[]> {
    const userId = req.user.id;

    if (search) {
      return this.projectService.searchByName(search, userId);
    }

    if (favorites === 'true') {
      return this.projectService.findFavoritesByUser(userId);
    }

    return this.projectService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ProjectResponseDto> {
    return this.projectService.findOne(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: any,
  ): Promise<ProjectResponseDto> {
    return this.projectService.update(id, updateProjectDto, req.user.id);
  }

  @Patch(':id/notes')
  async updateNotes(
    @Param('id') id: string,
    @Body() updateNotesDto: UpdateNotesDto,
    @Request() req: any,
  ): Promise<ProjectResponseDto> {
    return this.projectService.updateNotes(id, updateNotesDto, req.user.id);
  }

  @Patch(':id/favorite')
  async updateFavorite(
    @Param('id') id: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
    @Request() req: any,
  ): Promise<ProjectResponseDto> {
    return this.projectService.updateFavorite(
      id,
      updateFavoriteDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    return this.projectService.remove(id, req.user.id);
  }
}
