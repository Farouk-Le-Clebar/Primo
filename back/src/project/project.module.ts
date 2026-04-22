import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from '../database/project.entity';
import { ProjectMember } from '../database/project-member.entity';
import { User } from '../database/user.entity';
import { NotificationModule } from '../notification/notification.module';
import { ActivityHistoryModule } from '../history/history.module';
import { ProjectPlots } from 'src/database/project-plots.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectMember, User, ProjectPlots]),
    NotificationModule,
    ActivityHistoryModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
