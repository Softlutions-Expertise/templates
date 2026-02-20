import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { Unique } from '../../../helpers/validators/unique';
import { SecretariaMunicipalEntity } from '../entities/secretaria-municipal.entity';

export enum SecretariaMunicipalFindAllFilterConfiguracao {
  ALL = 'all',
  CONFIGURADO = 'configurado',
  NAO_CONFIGURADO = 'nao-configurado',
}
export enum SecretariaMunicipalFindAllFilterAction {
  'secretaria:read' = 'secretaria:read',
  'secretaria:update' = 'secretaria:update',
  'secretaria:delete' = 'secretaria:delete',
  'secretaria:criterios:read' = 'secretaria:criterios:read',
  'secretaria:criterios:change' = 'secretaria:criterios:change',
  'secretaria:gerencia_agendamento:update' = 'secretaria:gerencia_agendamento:update',
  'secretaria:gerencia_agendamento:read' = 'secretaria:gerencia_agendamento:read',
}

export class SecretariaMunicipalDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  logo: string;

  @ApiProperty()
  @Validate(Unique, [SecretariaMunicipalEntity])
  @MaxLength(14)
  @IsString()
  cnpj: string;

  @ApiProperty()
  @IsString()
  razaoSocial: string;

  @ApiProperty()
  @IsString()
  nomeFantasia: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  naturezaJuridica: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  dataCriacao: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  decreto: string;

  @ApiProperty()
  @IsString()
  secretario: string;

  @ApiProperty()
  @IsString()
  vincEnteFederativo: string;

  @ApiProperty()
  @IsString()
  prefeito: string;

  // data limite para verificação em qual etapa a criança se encaixa
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(0\d|1[0-2])-(0\d|[12]\d|3[01])$/, {
    message: 'O campo dataLimite deve estar no padrão MM-DD',
  })
  dataLimite: string;
}
