import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMember } from '../database/project-member.entity';
import { Project } from '../database/project.entity';
import { User } from '../database/user.entity';
import { ProjectMembersService } from './project-members.service';
import { ProjectMembersController } from './project-members.controller';
import { NotificationModule } from '../notification/notification.module';
import { ActivityHistoryModule } from '../history/history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMember, Project, User]),
    NotificationModule,
    ActivityHistoryModule,
  ],
  controllers: [ProjectMembersController],
  providers: [ProjectMembersService],
  exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
