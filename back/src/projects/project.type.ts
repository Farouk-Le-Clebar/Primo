import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID, MaxLength } from "class-validator";

export type CreateProjectDto = {
    name: string;
    description?: string;
};

export type AddPlotToProjectDto = {
    projectId: string;
    plotId: string;
    plotBanId: string;
    adress: string;
    coordinates: string;
    geometry: any;
    parcelProperties?: Record<string, any>;
    addressProperties?: Record<string, any>;
};

export class InviteUserDto {
  @IsUUID()
  projectId: string;

  @IsEmail()
  @MaxLength(255)
  email: string;
}

export class InvitationTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class RespondInvitationByTokenDto extends InvitationTokenDto {
  @IsBoolean()
  accept: boolean;
}

export class RespondInvitationDto {
  @IsBoolean()
  accept: boolean;
}

export class RequestDocumentUploadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  documentName: string;

  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @IsInt()
  @IsPositive()
  size: number;
}
