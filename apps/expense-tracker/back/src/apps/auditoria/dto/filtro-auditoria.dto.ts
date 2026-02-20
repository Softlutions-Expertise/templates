import { IsOptional, IsEnum, IsUUID, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoAcao } from '../entities/auditoria.entity';

export class FiltroAuditoriaDto {
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  jwtToken?: string;

  @IsOptional()
  @IsEnum(TipoAcao)
  acao?: TipoAcao;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
