import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityEventType } from '../../database/history.entity';


export class ActivityHistoryQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}


export class ActivityEventResponseDto {
  id: string;
  projectId: string;
  actorUserId: string | null;
  actorDisplayName: string;
  actorProfilePicture: string | null;
  eventType: ActivityEventType;
  payload: Record<string, any>;
  version: number;
  createdAt: Date;
}

export class ActivityHistoryPageDto {
  items: ActivityEventResponseDto[];
  nextCursor: string | null;
  hasMore: boolean;
}


export interface CreateActivityEventDto {
  projectId: string;
  actorUserId: string | null;
  actorDisplayName: string;
  eventType: ActivityEventType;
  payload: Record<string, any>;
}
