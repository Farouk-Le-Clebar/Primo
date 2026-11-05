import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectNotes } from 'src/database/project-notes.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectNotes]), JwtModule, ProjectsModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
