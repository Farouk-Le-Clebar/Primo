import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  surName: string;

  @IsString()
  @MinLength(6)
  password: string;
}
