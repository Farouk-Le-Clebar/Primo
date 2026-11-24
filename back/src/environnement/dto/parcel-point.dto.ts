import { IsLatitude, IsLongitude, Matches } from 'class-validator';

export class ParcelPointDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @Matches(/^[0-9AB]{5}$/, {
    message: 'Le code INSEE doit comporter 5 caractères.',
  })
  codeInsee: string;
}
