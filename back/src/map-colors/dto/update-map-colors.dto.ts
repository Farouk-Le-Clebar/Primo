import { Type } from 'class-transformer';
import {
  Equals,
  IsNumber,
  IsObject,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { MAP_COLORS_VERSION } from '../map-colors.defaults';

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export class ParcelColorsDto {
  @Matches(HEX_COLOR)
  fill: string;

  @Matches(HEX_COLOR)
  stroke: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  fillOpacity: number;
}

export class MapPaletteDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ParcelColorsDto)
  default: ParcelColorsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ParcelColorsDto)
  hover: ParcelColorsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ParcelColorsDto)
  selected: ParcelColorsDto;
}

export class UpdateMapColorsDto {
  @Equals(MAP_COLORS_VERSION)
  version: number;

  @IsObject()
  @ValidateNested()
  @Type(() => MapPaletteDto)
  light: MapPaletteDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MapPaletteDto)
  dark: MapPaletteDto;
}
