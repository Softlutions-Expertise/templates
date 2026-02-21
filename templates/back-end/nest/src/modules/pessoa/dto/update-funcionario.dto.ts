import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  TipoEnsinoMedio,
  NivelEscolaridade,
  PosGraduacaoConcluida,
} from '../entities/enums/pessoa.enum';
import { UpdateFuncionarioIntersectionDto } from './update-funcionario-intersection.dto';

export class UpdateFuncionarioDto extends PartialType(
  UpdateFuncionarioIntersectionDto,
) {
  @ApiPropertyOptional({
    enum: NivelEscolaridade,
  })
  @IsOptional()
  @IsEnum(NivelEscolaridade)
  nivelEscolaridade: NivelEscolaridade;

  @ApiPropertyOptional({
    enum: TipoEnsinoMedio,
  })
  @IsOptional()
  @IsEnum(TipoEnsinoMedio)
  tipoEnsinoMedio: TipoEnsinoMedio;

  @ApiPropertyOptional({
    enum: PosGraduacaoConcluida,
  })
  @IsOptional()
  @IsEnum(PosGraduacaoConcluida)
  posGraduacaoConcluida: PosGraduacaoConcluida;
}
