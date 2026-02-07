import {
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
  IsArray,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(64)
  name: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  parcels?: Array<{
    id: string;
    coordinates: [number, number];
    properties?: Record<string, any>;
  }>;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  name?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  parcels?: Array<{
    id: string;
    coordinates: [number, number];
    properties?: Record<string, any>;
  }>;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;
}

export class ProjectResponseDto {
  id: string;
  name: string;
  isFavorite: boolean;
  notes: string | null;
  parcels: Array<{
    id: string;
    coordinates: [number, number];
    properties?: Record<string, any>;
  }> | null;
  parameters: Record<string, any> | null;
  userId: string;
  createdAt: Date;
  modifiedAt: Date;
}

export class UpdateNotesDto {
  @IsString()
  notes: string;
}

export class UpdateFavoriteDto {
  @IsBoolean()
  isFavorite: boolean;
}
