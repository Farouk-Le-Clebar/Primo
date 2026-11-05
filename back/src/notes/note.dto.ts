import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export const NOTE_TITLE_MAX_LENGTH = 255;
export const NOTE_CONTENT_MAX_LENGTH = 50000;

export class CreateNoteDto {
    @IsOptional()
    @IsString()
    @MaxLength(NOTE_TITLE_MAX_LENGTH)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(NOTE_CONTENT_MAX_LENGTH)
    content?: string;
}

export class UpdateNoteDto extends CreateNoteDto {
    // Version of the note the client edited; used to detect concurrent edits.
    @IsInt()
    @Min(1)
    version: number;
}
