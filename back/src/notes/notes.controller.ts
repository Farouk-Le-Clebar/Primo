import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ProjectGuard } from 'src/guard/project.guard';
import { CreateNoteDto, UpdateNoteDto } from './note.dto';
import { NotesService } from './notes.service';

@UseGuards(JwtAuthGuard, ProjectGuard)
@Controller('projects/:projectId/notes')
export class NotesController {
    constructor(
        private readonly notesService: NotesService,
    ) { }

    @Get()
    async getNotes(@Param('projectId') projectId: string) {
        return this.notesService.getNotes(projectId);
    }

    @Post()
    async createNote(@Req() req, @Param('projectId') projectId: string, @Body() dto: CreateNoteDto) {
        return this.notesService.createNote(projectId, dto, req.user.id);
    }

    @Patch(':noteId')
    async updateNote(@Req() req, @Param('projectId') projectId: string, @Param('noteId', ParseUUIDPipe) noteId: string, @Body() dto: UpdateNoteDto) {
        return this.notesService.updateNote(projectId, noteId, dto, req.user.id);
    }

    @Delete(':noteId')
    async deleteNote(@Param('projectId') projectId: string, @Param('noteId', ParseUUIDPipe) noteId: string) {
        return this.notesService.deleteNote(projectId, noteId);
    }
}
