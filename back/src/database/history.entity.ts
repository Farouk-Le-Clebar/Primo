import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum ActivityEventType {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_NOTES_UPDATED = 'PROJECT_NOTES_UPDATED',
  MEMBER_INVITED = 'MEMBER_INVITED',
  MEMBER_ACCEPTED = 'MEMBER_ACCEPTED',
  MEMBER_DECLINED = 'MEMBER_DECLINED',
  MEMBER_ROLE_UPDATED = 'MEMBER_ROLE_UPDATED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
}

export type ActivityEventPayload =
  | { type: ActivityEventType.PROJECT_CREATED; projectName: string }
  | {
      type: ActivityEventType.PROJECT_UPDATED;
      changedFields: string[];
      projectName: string;
    }
  | {
      type: ActivityEventType.PROJECT_NOTES_UPDATED;
      projectName: string;
    }
  | {
      type: ActivityEventType.MEMBER_INVITED;
      invitedEmail: string;
      invitedUserId: string;
      role: string;
      projectName: string;
    }
  | {
      type: ActivityEventType.MEMBER_ACCEPTED;
      memberId: string;
      projectName: string;
    }
  | {
      type: ActivityEventType.MEMBER_DECLINED;
      memberId: string;
      projectName: string;
    }
  | {
      type: ActivityEventType.MEMBER_ROLE_UPDATED;
      targetUserId: string;
      targetDisplayName: string;
      previousRole: string;
      newRole: string;
      projectName: string;
    }
  | {
      type: ActivityEventType.MEMBER_REMOVED;
      removedUserId: string;
      removedDisplayName: string;
      role: string;
      projectName: string;
    };

@Entity('activity_events')
@Index('idx_activity_events_project_timeline', ['projectId', 'createdAt', 'id'])
export class ActivityEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  projectId: string;

  
  @Column({ type: 'uuid', nullable: true })
  actorUserId: string | null;

  @Column({ type: 'varchar', length: 255 })
  actorDisplayName: string;

  @Column({
    type: 'enum',
    enum: ActivityEventType,
  })
  eventType: ActivityEventType;

  @Column({ type: 'json' })
  payload: ActivityEventPayload;

  @Column({ type: 'int', default: 1 })
  version: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}