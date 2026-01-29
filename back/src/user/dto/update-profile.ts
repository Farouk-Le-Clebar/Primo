import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  surName?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
