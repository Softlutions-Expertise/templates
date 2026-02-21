import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum FilterPreferredGroups {
  'Possui ao menos 1 da seleção' = 'Possui ao menos 1 da seleção',
  'Possui todos da seleção' = 'Possui todos da seleção',
}

export enum Situation {
  'Todos' = 'Todos',
  'Elegível Para Fila' = 'Elegível Para Fila',
  'Fora da Fila de Espera' = 'Fora da Fila de Espera',
  'Transferida' = 'Transferida',
  'Aguardando Transferência' = 'Aguardando Transferência',
}

export enum Vacancy {
  'Todos' = 'Todos',
  'Aguardando Vaga' = 'Aguardando Vaga',
  'Vaga Concedida' = 'Vaga Concedida',
}

export enum Turn {
  'Matutino' = 'Matutino',
  'Vespertino' = 'Vespertino',
  'Integral' = 'Integral',
}

export enum ResponsibleType {
  'Pai' = 'Pai',
  'Mãe' = 'Mãe',
  'Outro' = 'Outro',
}

export class ReportEntrevistaDTO {
  @ApiProperty({
    type: String,
    example: '7ef0d710-1876-4fca-8842-4f12a5bab75c',
  })
  @IsNotEmpty()
  @IsString()
  secretariaMunicipalId: string;

  @ApiPropertyOptional({
    type: String,
    example: '7ef0d710-1876-4fca-8842-4f12a5bab75c',
  })
  @IsOptional()
  @IsString()
  entrevistadorId: string;

  @ApiPropertyOptional({ type: String, example: '2021-01-01' })
  @IsOptional()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ type: String, example: '2021-02-01' })
  @IsOptional()
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

  @ApiPropertyOptional({ enum: ResponsibleType, example: 'Mãe' })
  @IsOptional()
  @IsEnum(ResponsibleType)
  responsibleType: ResponsibleType;

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
    type: Boolean,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  brotherSchool: string;

  @ApiPropertyOptional({
    type: Number,
    example: '1',
  })
  @IsOptional()
  @IsString()
  startMembersAddress: string;

  @ApiPropertyOptional({
    type: Number,
    example: '10',
  })
  @IsOptional()
  @IsString()
  endMembersAddress: string;

  @ApiPropertyOptional({
    type: Number,
    example: '1',
  })
  @IsOptional()
  @IsString()
  startMembersFamilyIncome: string;

  @ApiPropertyOptional({
    type: Number,
    example: '10',
  })
  @IsOptional()
  @IsString()
  endMembersFamilyIncome: string;

  @ApiPropertyOptional({
    type: Number,
    example: '1000',
  })
  @IsOptional()
  @IsString()
  startFamilyIncome: string;

  @ApiPropertyOptional({
    type: Number,
    example: '2000',
  })
  @IsOptional()
  @IsString()
  endFamilyIncome: string;

  @ApiPropertyOptional({
    enum: Vacancy,
    example: 'Todos',
  })
  @IsOptional()
  @IsEnum(Vacancy)
  vacancy: Vacancy;

  @ApiPropertyOptional({
    enum: Situation,
    example: 'Todos',
  })
  @IsOptional()
  @IsEnum(Situation)
  situation: Situation;

  @ApiPropertyOptional({
    isArray: true,
    example:
      '7ef0d710-1876-4fca-8842-4f12a5bab75c,7ef0d710-1876-4fca-8842-4f12a5bab75c',
  })
  @IsOptional()
  @IsString({ each: true })
  preferredGroups: string[];

  @ApiPropertyOptional({
    enum: FilterPreferredGroups,
    example: 'Possui ao menos 1 da seleção',
  })
  @IsOptional()
  @IsEnum(FilterPreferredGroups)
  filterPreferredGroups: FilterPreferredGroups;

  @ApiPropertyOptional({
    type: Boolean,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  anonymizeData: string;
}
