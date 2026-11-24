import {
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export const ADDRESS_CATEGORIES = ['agence', 'client', 'ecole', 'transport', 'travail', 'sante', 'autre'] as const;

export class CreateProjectAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsIn(ADDRESS_CATEGORIES)
  category?: string;
}
