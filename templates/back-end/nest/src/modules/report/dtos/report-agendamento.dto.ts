import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum TypeReportAgendamento {
  'agendamento-por-periodo' = 'agendamento-por-periodo',
  'agendamento-atendido' = 'agendamento-atendido',
  'agendamento-nao-atendido' = 'agendamento-nao-atendido',
}

export class ReportAgendamentoDTO {
  @ApiProperty({
    type: String,
    example: '7ef0d710-1876-4fca-8842-4f12a5bab75c',
  })
  @IsNotEmpty()
  @IsString()
  secretariaMunicipalId: string;

  @ApiProperty({
    enum: TypeReportAgendamento,
    example: 'agendamento-por-periodo',
  })
  @IsNotEmpty()
  @IsEnum(TypeReportAgendamento)
  type: TypeReportAgendamento;

  @ApiProperty({ type: String, example: '2021-01-01' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: String, example: '2021-02-01' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ type: String, example: '08:00' })
  @IsOptional()
  @IsString()
  startTime: string;

  @ApiPropertyOptional({ type: String, example: '18:00' })
  @IsOptional()
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ type: String, example: '2021-01-01' })
  @IsOptional()
  @IsDateString()
  startDateBirth: string;

  @ApiPropertyOptional({ type: String, example: '2021-02-01' })
  @IsOptional()
  @IsDateString()
  endDateBirth: string;

  @ApiPropertyOptional({ type: String, example: '12345678901' })
  @IsOptional()
  @IsString()
  cpfChild: string;
}
