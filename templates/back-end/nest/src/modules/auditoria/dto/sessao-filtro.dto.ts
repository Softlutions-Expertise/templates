import { IsUUID, IsOptional } from 'class-validator';

export class SessaoFiltroDto {
  @IsOptional()
  @IsUUID()
  usuarioId?: string;
}
