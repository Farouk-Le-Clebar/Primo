import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ActivityHistoryService } from './history.service';
import { ActivityHistoryQueryDto, ActivityHistoryPageDto } from './dto/history.dto';

/**
 * Assumes a JwtAuthGuard (or equivalent) attaches `req.user.id` — adapt the
 * guard import to match your project's auth module.
 *
 * Replace `JwtAuthGuard` and the `@Req()` extraction with your actual auth
 * decorators if they differ (e.g. a custom `@CurrentUser()` decorator).
 */
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('projects/:projectId/activity-history')
@UseGuards(JwtAuthGuard)
export class ActivityHistoryController {
  constructor(private readonly activityHistoryService: ActivityHistoryService) {}

  /**
   * GET /projects/:projectId/activity-history?cursor=<base64>&limit=<1-100>
   *
   * Returns a cursor-paginated, descending timeline of activity events for the
   * given project.  Only the project owner and accepted members may call this
   * endpoint (403 otherwise).
   */
  @Get()
  async getHistory(
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Query() query: ActivityHistoryQueryDto,
    @Req() req: { user: { id: string } },
  ): Promise<ActivityHistoryPageDto> {
    const userId = req.user.id;
    const limit = query.limit ?? 20; //limite par défo à 20 pour le nbr d'activité retourné 

    return this.activityHistoryService.getProjectHistory(
      projectId,
      userId,
      limit,
      query.cursor,
    );
  }
}