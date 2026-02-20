import { IsEnum, IsOptional, IsUUID, IsString, IsObject } from 'class-validator';
import { TipoAcao } from '../entities/auditoria.entity';

export class CriarAuditoriaDto {
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  usuarioEmail?: string;

  @IsEnum(TipoAcao)
  acao: TipoAcao;

  @IsString()
  entidade: string;

  @IsOptional()
  @IsUUID()
  entidadeId?: string;

  @IsOptional()
  @IsObject()
  dadosAnteriores?: Record<string, any>;

  @IsOptional()
  @IsObject()
  dadosNovos?: Record<string, any>;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  jwtToken?: string;
}
