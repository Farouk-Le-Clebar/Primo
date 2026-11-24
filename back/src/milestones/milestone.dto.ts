import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export const MILESTONE_TITLE_MAX_LENGTH = 255;
export const MILESTONE_DESCRIPTION_MAX_LENGTH = 2000;

export class CreateMilestoneDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MILESTONE_TITLE_MAX_LENGTH)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(MILESTONE_DESCRIPTION_MAX_LENGTH)
  description?: string | null;

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;
}

export class UpdateMilestoneDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(MILESTONE_TITLE_MAX_LENGTH)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MILESTONE_DESCRIPTION_MAX_LENGTH)
  description?: string | null;

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
