import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Projects } from 'src/database/project.entity';
import { ProjectPlots } from 'src/database/project-plots.entity';
import { ProjectMembers } from 'src/database/project-members.entity';
import { User } from 'src/database/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Projects, ProjectPlots, ProjectMembers, User]), JwtModule],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}
