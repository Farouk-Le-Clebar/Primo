import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectNotes } from 'src/database/project-notes.entity';
import { CreateNoteDto, UpdateNoteDto } from './note.dto';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(ProjectNotes)
        private notesRepository: Repository<ProjectNotes>,
    ) { }

    async getNotes(projectId: string) {
        return this.notesRepository.find({ where: { projectId }, order: { updatedAt: 'DESC' } });
    }

    async createNote(projectId: string, dto: CreateNoteDto, userId: string) {
        return this.notesRepository.save(this.notesRepository.create({
            projectId,
            title: dto.title ?? '',
            content: dto.content ?? '',
            createdBy: userId,
            updatedBy: userId,
        }));
    }

    async updateNote(projectId: string, noteId: string, dto: UpdateNoteDto, userId: string) {
        // The version check and the increment happen in one statement, so two concurrent saves cannot both win.
        const result = await this.notesRepository
            .createQueryBuilder()
            .update(ProjectNotes)
            .set({
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.content !== undefined && { content: dto.content }),
                version: () => 'version + 1',
                updatedBy: userId,
            })
            .where('id = :noteId AND "projectId" = :projectId AND version = :version', { noteId, projectId, version: dto.version })
            .execute();

        const note = await this.notesRepository.findOneBy({ id: noteId, projectId });
        if (!note)
            throw new NotFoundException('Note introuvable.');
        if (!result.affected)
            throw new ConflictException({ message: 'La note a été modifiée par un autre membre.', note });
        return note;
    }

    async deleteNote(projectId: string, noteId: string) {
        const result = await this.notesRepository.delete({ id: noteId, projectId });
        if (!result.affected)
            throw new NotFoundException('Note introuvable.');
        return { success: true };
    }
}
