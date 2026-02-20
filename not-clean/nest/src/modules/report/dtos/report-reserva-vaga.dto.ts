import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ReservaVagaStatus {
  PENDENTE = 'Pendente',
  DEFERIDA = 'Deferida',
  INDEFERIDA = 'Indeferida',
  AUSENTE = 'Ausente',
  TRANSFERIDA = 'Transferida',
}

export enum Turn {
  'Matutino' = 'Matutino',
  'Vespertino' = 'Vespertino',
  'Integral' = 'Integral',
}

export class ReportReservaVagaDTO {
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

  @ApiPropertyOptional({
    enum: ReservaVagaStatus,
    example: ReservaVagaStatus.PENDENTE,
  })
  @IsOptional()
  @IsEnum(ReservaVagaStatus)
  status: ReservaVagaStatus;

  @ApiPropertyOptional({ type: String, example: '2021-01-01' })
  @IsOptional()
  @IsDateString()
  startDateOccupation: string;

  @ApiPropertyOptional({ type: String, example: '2021-02-01' })
  @IsOptional()
  @IsDateString()
  endDateOccupation: string;

  @ApiPropertyOptional({ type: String, example: '2021-01-01' })
  @IsOptional()
  @IsDateString()
  startDateReference: string;

  @ApiPropertyOptional({ type: String, example: '2021-02-01' })
  @IsOptional()
  @IsDateString()
  endDateReference: string;

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
