import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectNotes } from 'src/database/project-notes.entity';
import { User } from 'src/database/user.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { NotificationModule } from 'src/notification/notification.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectNotes, User]), JwtModule, ProjectsModule, NotificationModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
