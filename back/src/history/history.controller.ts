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
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('projects/:projectId/activity-history')
@UseGuards(JwtAuthGuard)
export class ActivityHistoryController {
  constructor(private readonly activityHistoryService: ActivityHistoryService) {}

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