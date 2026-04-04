import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from '../database/project.entity';
import { ProjectMember } from '../database/project-member.entity';
import { User } from '../database/user.entity';
import { NotificationModule } from '../notification/notification.module';
import { ActivityHistoryModule } from '../history/history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectMember, User]),
    NotificationModule,
    ActivityHistoryModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
