import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import {
  InviteMemberDto,
  UpdateMemberRoleDto,
  MemberResponseDto,
} from './dto/project-members.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('projects/:projectId/members')
@UseGuards(JwtAuthGuard)
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Post('invite')
  @HttpCode(HttpStatus.CREATED)
  async invite(
    @Param('projectId') projectId: string,
    @Body() dto: InviteMemberDto,
    @Request() req: any,
  ): Promise<MemberResponseDto> {
    return this.projectMembersService.invite(projectId, req.user.id, dto);
  }

  @Get()
  async getMembers(
    @Param('projectId') projectId: string,
    @Request() req: any,
  ): Promise<MemberResponseDto[]> {
    return this.projectMembersService.getMembers(projectId, req.user.id);
  }

  @Patch(':memberId/role')
  async updateRole(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
    @Request() req: any,
  ): Promise<MemberResponseDto> {
    return this.projectMembersService.updateRole(
      projectId,
      memberId,
      req.user.id,
      dto,
    );
  }

  @Patch(':memberId/respond')
  async respondToInvitation(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() body: { accept: boolean },
    @Request() req: any,
  ): Promise<MemberResponseDto> {
    return this.projectMembersService.respondToInvitation(
      projectId,
      memberId,
      req.user.id,
      body.accept,
    );
  }

  @Delete(':memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Request() req: any,
  ): Promise<void> {
    return this.projectMembersService.removeMember(
      projectId,
      memberId,
      req.user.id,
    );
  }
}
