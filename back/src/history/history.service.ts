import {
  Injectable,
  ForbiddenException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ActivityEvent, ActivityEventType } from '../database/history.entity';
import {
  ProjectMember,
  ProjectMemberStatus,
} from '../database/project-member.entity';
import { Project } from '../database/project.entity';
import {
  ActivityHistoryPageDto,
  ActivityEventResponseDto,
  CreateActivityEventDto,
} from './dto/history.dto';
import { User } from '../database/user.entity';


const CURSOR_SEPARATOR = '__';

function encodeCursor(createdAt: Date, id: string): string {
  const raw = `${createdAt.toISOString()}${CURSOR_SEPARATOR}${id}`;
  return Buffer.from(raw, 'utf8').toString('base64url');
}

function decodeCursor(cursor: string): { createdAt: Date; id: string } | null {
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    const sepIdx = raw.lastIndexOf(CURSOR_SEPARATOR);
    if (sepIdx === -1) return null;
    const iso = raw.slice(0, sepIdx);
    const id = raw.slice(sepIdx + CURSOR_SEPARATOR.length);
    const createdAt = new Date(iso);
    if (isNaN(createdAt.getTime())) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
}

@Injectable()
export class ActivityHistoryService {
  private readonly logger = new Logger(ActivityHistoryService.name);

  constructor(
    @InjectRepository(ActivityEvent)
    private readonly activityRepo: Repository<ActivityEvent>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async record(dto: CreateActivityEventDto): Promise<void> {
    try {
      const event = this.activityRepo.create({
        projectId: dto.projectId,
        actorUserId: dto.actorUserId,
        actorDisplayName: dto.actorDisplayName,
        eventType: dto.eventType,
        payload: dto.payload as any,
        version: 1,
      });
      await this.activityRepo.save(event);
    } catch (error) {
      this.logger.error(
        `Failed to record activity event [type=${dto.eventType}, projectId=${dto.projectId}]: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }

  async getProjectHistory(
    projectId: string,
    requesterId: string,
    limit: number,
    cursor?: string,
  ): Promise<ActivityHistoryPageDto> {

    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    await this.assertReadAccess(projectId, requesterId, project);

    const effectiveLimit = Math.min(Math.max(limit, 1), 100);
    const fetchLimit = effectiveLimit + 1;

    let events: ActivityEvent[];

    if (cursor) {
      const decoded = decodeCursor(cursor);
      if (!decoded) {
        this.logger.warn(
          `Invalid cursor received for projectId=${projectId}, ignoring.`,
        );
        events = await this.fetchPage(projectId, fetchLimit);
      } else {
        events = await this.fetchPageAfterCursor(
          projectId,
          fetchLimit,
          decoded.createdAt,
          decoded.id,
        );
      }
    } else {
      events = await this.fetchPage(projectId, fetchLimit);
    }

    const hasMore = events.length > effectiveLimit;
    const items = hasMore ? events.slice(0, effectiveLimit) : events;

    const actorUserIds = Array.from(
      new Set(
        items.map((e) => e.actorUserId).filter((id): id is string => !!id),
      ),
    );

    const actorProfilePictures =
      await this.getActorProfilePictures(actorUserIds);

    const nextCursor =
      hasMore && items.length > 0
        ? encodeCursor(
            items[items.length - 1].createdAt,
            items[items.length - 1].id,
          )
        : null;

    return {
      items: items.map((e) =>
        this.toResponseDto(
          e,
          e.actorUserId
            ? (actorProfilePictures.get(e.actorUserId) ?? null)
            : null,
        ),
      ),
      nextCursor,
      hasMore,
    };
  }

  private async getActorProfilePictures(
    actorUserIds: string[],
  ): Promise<Map<string, string | null>> {
    if (actorUserIds.length === 0) {
      return new Map();
    }

    const users = await this.userRepo.find({
      where: { id: In(actorUserIds) },
      select: ['id', 'profilePicture'],
    });

    return new Map(users.map((user) => [user.id, user.profilePicture]));
  }

  private async fetchPage(
    projectId: string,
    limit: number,
  ): Promise<ActivityEvent[]> {
    return this.activityRepo.find({
      where: { projectId },
      order: { createdAt: 'DESC', id: 'DESC' },
      take: limit,
    });
  }


  private async fetchPageAfterCursor(
    projectId: string,
    limit: number,
    cursorCreatedAt: Date,
    cursorId: string,
  ): Promise<ActivityEvent[]> {
    return this.activityRepo
      .createQueryBuilder('ae')
      .where('ae.projectId = :projectId', { projectId })
      .andWhere(
        '(ae.createdAt < :cursorCreatedAt OR (ae.createdAt = :cursorCreatedAt AND ae.id < :cursorId))',
        { cursorCreatedAt, cursorId },
      )
      .orderBy('ae.createdAt', 'DESC')
      .addOrderBy('ae.id', 'DESC')
      .take(limit)
      .getMany();
  }

  private async assertReadAccess(
    projectId: string,
    userId: string,
    project: Project,
  ): Promise<void> {
    if (project.userId === userId) return; // owner always has access

    const membership = await this.memberRepo.findOne({
      where: {
        projectId,
        userId,
        status: ProjectMemberStatus.ACCEPTED,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this project history',
      );
    }
  }

  private toResponseDto(
    event: ActivityEvent,
    actorProfilePicture: string | null,
  ): ActivityEventResponseDto {
    return {
      id: event.id,
      projectId: event.projectId,
      actorUserId: event.actorUserId,
      actorDisplayName: event.actorDisplayName,
      actorProfilePicture,
      eventType: event.eventType,
      payload: event.payload as Record<string, any>,
      version: event.version,
      createdAt: event.createdAt,
    };
  }
}
