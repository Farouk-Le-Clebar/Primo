import { IsString, IsEnum, IsEmail, IsOptional, IsUUID } from 'class-validator';
import {
  ProjectMemberRole,
  ProjectMemberStatus,
} from '../../database/project-member.entity';


export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(ProjectMemberRole)
  role?: ProjectMemberRole;
}


export class UpdateMemberRoleDto {
  @IsEnum(ProjectMemberRole)
  role: ProjectMemberRole;
}


export class MemberResponseDto {
  id: string;
  projectId: string;
  userId: string;
  email: string;
  firstName: string;
  surName: string;
  profilePicture: string | null;
  role: ProjectMemberRole;
  status: ProjectMemberStatus;
  invitedBy: string | null;
  invitedAt: Date;
  acceptedAt: Date | null;
}
