import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectNotes } from 'src/database/project-notes.entity';
import { CreateNoteDto, UpdateNoteDto } from './note.dto';
import { ProjectActivityNotifier } from 'src/notification/project-activity.notifier';
import { User } from 'src/database/user.entity';
import { In } from 'typeorm';
import { UpdateNoteMetaDto } from './note.dto';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(ProjectNotes)
        private notesRepository: Repository<ProjectNotes>,
        private activityNotifier: ProjectActivityNotifier,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async getNotes(projectId: string) {
        const notes = await this.notesRepository.find({ where: { projectId }, order: { isPinned: 'DESC', updatedAt: 'DESC' } });
        const authorIds = [...new Set(notes.map(note => note.createdBy).filter((id): id is string => !!id))];
        const authors = authorIds.length ? await this.usersRepository.findBy({ id: In(authorIds) }) : [];
        const names = new Map(authors.map(author => [author.id, `${author.firstName} ${author.surName}`.trim()]));
        return notes.map(note => ({ ...note, authorName: note.createdBy ? names.get(note.createdBy) ?? null : null }));
    }

    async updateNoteMeta(projectId: string, noteId: string, dto: UpdateNoteMetaDto) {
        const note = await this.notesRepository.findOneBy({ id: noteId, projectId });
        if (!note)
            throw new NotFoundException('Note introuvable.');
        if (dto.isPinned !== undefined)
            note.isPinned = dto.isPinned;
        if (dto.plotId !== undefined)
            note.plotId = dto.plotId;
        return this.notesRepository.save(note);
    }

    async createNote(projectId: string, dto: CreateNoteDto, userId: string) {
        const note = await this.notesRepository.save(this.notesRepository.create({
            projectId,
            title: dto.title ?? '',
            content: dto.content ?? '',
            createdBy: userId,
            updatedBy: userId,
        }));
        await this.activityNotifier.notify(projectId, userId, 'note', {
            noteId: note.id,
            title: note.title,
            excerpt: note.content.slice(0, 160),
        });
        return note;
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
