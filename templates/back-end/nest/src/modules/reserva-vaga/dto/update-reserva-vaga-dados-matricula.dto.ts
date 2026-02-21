import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateReservaVagaDadosMatriculaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  matricula?: string;
}
