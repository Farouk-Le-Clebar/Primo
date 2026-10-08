import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsObject,
  IsString,
  MaxLength,
} from 'class-validator';

export class ComputeProximiteDto {
  @IsObject()
  geometry: Record<string, unknown>;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  types: string[];
}