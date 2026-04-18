import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SendResetEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDTO {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  token: string;
}