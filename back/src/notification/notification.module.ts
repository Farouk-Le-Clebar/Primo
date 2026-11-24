import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from '../database/notification.entity';
import { User } from '../database/user.entity';
import { ProjectMembers } from '../database/project-members.entity';
import { Projects } from '../database/project.entity';
import { ProjectActivityNotifier } from './project-activity.notifier';
import { UserNotifier } from './user-notifier';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, ProjectMembers, Projects])],
  controllers: [NotificationController],
  providers: [NotificationService, ProjectActivityNotifier, UserNotifier],
  exports: [NotificationService, ProjectActivityNotifier, UserNotifier],
})
export class NotificationModule {}
