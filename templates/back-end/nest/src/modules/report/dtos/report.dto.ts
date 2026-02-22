import { IsOptional, IsString } from 'class-validator';

/**
 * DTO base para filtros de relatórios.
 * Estenda este DTO para criar filtros específicos de cada relatório.
 */
export class ReportDto {
  @IsOptional()
  @IsString()
  instituicaoId?: string;

  @IsOptional()
  @IsString()
  dataInicio?: string;

  @IsOptional()
  @IsString()
  dataFim?: string;

  @IsOptional()
  @IsString()
  formato?: 'pdf' | 'excel' | 'csv';
}
