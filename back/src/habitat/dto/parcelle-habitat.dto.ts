import { IsObject, Matches } from 'class-validator';

export const PARCELLE_PATTERN = /^[0-9AB]{5}[0-9]{3}[0-9A-Z]{2}[0-9]{4}$/;

export class ParcelleHabitatDto {
  @Matches(PARCELLE_PATTERN, {
    message: 'La référence cadastrale doit comporter 14 caractères valides.',
  })
  idParcelle: string;

  @IsObject()
  geometry: Record<string, unknown>;
}
