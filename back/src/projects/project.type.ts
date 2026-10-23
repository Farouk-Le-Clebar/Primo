import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from "class-validator";

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
};

export type InviteUserDto = {
    projectId: string;
    email: string;
};

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
