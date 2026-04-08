import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

export enum ProjectMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  CO_ADMIN = 'co-admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum ProjectMemberStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Entity('project_members')
@Unique(['projectId', 'userId'])
@Index('IDX_PROJECT_MEMBERS_PROJECT_STATUS', ['projectId', 'status'])
@Index('IDX_PROJECT_MEMBERS_USER_STATUS', ['userId', 'status'])
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'uuid' })
  projectId: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ProjectMemberRole,
    default: ProjectMemberRole.VIEWER,
  })
  role: ProjectMemberRole;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'invitedBy' })
  inviter: User;

  @Column({ type: 'uuid', nullable: true })
  invitedBy: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  invitedAt: Date;

  @Column({
    type: 'enum',
    enum: ProjectMemberStatus,
    default: ProjectMemberStatus.PENDING,
  })
  status: ProjectMemberStatus;

  @Column({ type: 'timestamp', nullable: true, default: null })
  acceptedAt: Date | null;
}
