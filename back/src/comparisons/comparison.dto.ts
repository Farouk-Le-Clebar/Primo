import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateComparisonDto {
    @IsUUID()
    plotAId: string;

    @IsUUID()
    plotBId: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    question?: string;
}
