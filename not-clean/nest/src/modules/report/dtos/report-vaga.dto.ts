import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum TypeReportVaga {
  'vagas-livres' = 'vagas-livres',
  'vagas-ocupadas' = 'vagas-ocupadas',
}

export enum Turn {
  'Matutino' = 'Matutino',
  'Vespertino' = 'Vespertino',
  'Integral' = 'Integral',
}

export class ReportVagaDTO {
  @ApiProperty({
    type: String,
    example: '7ef0d710-1876-4fca-8842-4f12a5bab75c',
  })
  @IsNotEmpty()
  @IsString()
  secretariaMunicipalId: string;

  @ApiProperty({
    type: String,
    example: '2021',
  })
  @IsNotEmpty()
  @IsString()
  year: string;

  @ApiPropertyOptional({
    type: String,
    example: '7ef0d710-1876-4fca-8842-4f12a5bab75c',
  })
  @IsOptional()
  @IsString()
  unidadeEscolarId: string;

  @ApiPropertyOptional({
    type: String,
    example: '1',
  })
  @IsOptional()
  @IsString()
  etapaId: string;

  @ApiPropertyOptional({
    enum: Turn,
    example: 'Matutino',
  })
  @IsOptional()
  @IsEnum(Turn)
  turn: Turn;

  @ApiPropertyOptional({
    type: String,
    example: 1,
  })
  @IsOptional()
  @IsString()
  turmaId: string;

  @ApiProperty({
    enum: TypeReportVaga,
    example: 'vagas-livres',
  })
  @IsNotEmpty()
  @IsEnum(TypeReportVaga)
  type: TypeReportVaga;

  @ApiPropertyOptional({ type: String, example: '2021-01-01' })
  @IsOptional()
  @IsDateString()
  startDateRegistration: string;

  @ApiPropertyOptional({ type: String, example: '2021-02-01' })
  @IsOptional()
  @IsDateString()
  endDateRegistration: string;

  @ApiPropertyOptional({ type: String, example: '2021-01-01' })
  @IsOptional()
  @IsDateString()
  startDateOccupation: string;

  @ApiPropertyOptional({ type: String, example: '2021-02-01' })
  @IsOptional()
  @IsDateString()
  endDateOccupation: string;

  @ApiPropertyOptional({
    type: Boolean,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  anonymizeData: string;
}
