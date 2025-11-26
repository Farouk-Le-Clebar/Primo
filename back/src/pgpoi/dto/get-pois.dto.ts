import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetPoisDto {
  @IsNumber()
  @Type(() => Number)
  minLat: number;

  @IsNumber()
  @Type(() => Number)
  minLon: number;

  @IsNumber()
  @Type(() => Number)
  maxLat: number;

  @IsNumber()
  @Type(() => Number)
  maxLon: number;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((t) => t.trim());
    }
    return value;
  })
  @IsOptional()
  types?: string[];

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  zoom?: number;
}

export interface PoiResponse {
  id: string;
  name: string;
  type: string;
  category: string;
  lat: number;
  lon: number;
  tags?: Record<string, any>;
}