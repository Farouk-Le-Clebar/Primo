import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMilestones } from 'src/database/project-milestones.entity';
import { User } from 'src/database/user.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMilestones, User]),
    JwtModule,
    ProjectsModule,
    NotificationModule,
  ],
  controllers: [MilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule {}
