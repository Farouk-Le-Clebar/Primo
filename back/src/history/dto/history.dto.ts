import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityEventType } from '../../database/history.entity';

// ── Query DTO ────────────────────────────────────────────────────────────────

export class ActivityHistoryQueryDto {
  /**
   * Opaque cursor returned by a previous page.
   * Format (before base64 encoding): "<createdAt ISO>__<id UUID>"
   */
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

// ── Response DTOs ─────────────────────────────────────────────────────────────

export class ActivityEventResponseDto {
  id: string;
  projectId: string;
  actorUserId: string | null;
  actorDisplayName: string;
  eventType: ActivityEventType;
  payload: Record<string, any>;
  version: number;
  createdAt: Date;
}

export class ActivityHistoryPageDto {
  items: ActivityEventResponseDto[];
  /**
   * Pass this value as `cursor` in the next request to fetch the following page.
   * Null when `hasMore` is false.
   */
  nextCursor: string | null;
  hasMore: boolean;
}

// ── Internal write DTO (used by service, not exposed via HTTP) ─────────────────

export interface CreateActivityEventDto {
  projectId: string;
  actorUserId: string | null;
  actorDisplayName: string;
  eventType: ActivityEventType;
  payload: Record<string, any>;
}
