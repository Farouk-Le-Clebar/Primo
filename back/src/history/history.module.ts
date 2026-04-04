import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEvent } from '../database/history.entity';
import { ProjectMember } from '../database/project-member.entity';
import { Project } from '../database/project.entity';
import { User } from '../database/user.entity';
import { ActivityHistoryService } from './history.service';
import { ActivityHistoryController } from './history.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityEvent, ProjectMember, Project, User]),
  ],
  controllers: [ActivityHistoryController],
  providers: [ActivityHistoryService],
  exports: [ActivityHistoryService],
})
export class ActivityHistoryModule {}
