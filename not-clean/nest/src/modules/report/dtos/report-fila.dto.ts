import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum LastContactResult {
  'Vaga Aceita' = 'Vaga Aceita',
  'Vaga Recusada' = 'Vaga Recusada',
  'Não Atendido' = 'Não Atendido',
  'Não Encontrado' = 'Não Encontrado',
}

export enum Turn {
  'Matutino' = 'Matutino',
  'Vespertino' = 'Vespertino',
  'Integral' = 'Integral',
}

export class ReportFilaDTO {
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
  startPosition: string;

  @ApiPropertyOptional({
    type: String,
    example: 10,
  })
  @IsOptional()
  @IsString()
  endPosition: string;

  @ApiPropertyOptional({
    type: String,
    example: '2021-01-01',
  })
  @IsOptional()
  @IsDateString()
  startEntryDate: string;

  @ApiPropertyOptional({
    type: String,
    example: '2021-02-01',
  })
  @IsOptional()
  @IsDateString()
  endEntryDate: string;

  @ApiPropertyOptional({
    type: String,
    example: '1',
  })
  @IsOptional()
  @IsString()
  startDayStay: string;

  @ApiPropertyOptional({
    type: String,
    example: '10',
  })
  @IsOptional()
  @IsString()
  endDayStay: string;

  @ApiPropertyOptional({
    enum: LastContactResult,
    example: 'Vaga Aceita',
  })
  @IsOptional()
  @IsString()
  lastContactResult: string;

  @ApiPropertyOptional({
    type: Boolean,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  linePerVacancy: string;

  @ApiPropertyOptional({
    type: Boolean,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  oneLinePerPage: string;

  @ApiPropertyOptional({
    type: Boolean,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  viewPreferredGroups;

  @ApiPropertyOptional({
    type: Boolean,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  anonymizeData: string;
}
