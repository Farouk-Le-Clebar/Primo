import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEvent } from '../database/history.entity';
import { ProjectMember } from '../database/project-member.entity';
import { Project } from '../database/project.entity';
import { ActivityHistoryService } from './history.service';
import { ActivityHistoryController } from './history.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityEvent, ProjectMember, Project]),
  ],
  controllers: [ActivityHistoryController],
  providers: [ActivityHistoryService],
  /**
   * Export the service so that ProjectService and ProjectMembersService can
   * inject it directly without going through the notification pipeline.
   */
  exports: [ActivityHistoryService],
})
export class ActivityHistoryModule {}