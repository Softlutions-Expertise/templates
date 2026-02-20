import { IsOptional, IsString } from 'class-validator';

export class ReportDto {
  @IsOptional()
  @IsString()
  unidadeEscolar: string;

  @IsOptional()
  @IsString()
  secretariaMunicipal: string;
}
