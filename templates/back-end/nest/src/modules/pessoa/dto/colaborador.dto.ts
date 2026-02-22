import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import {
  Cargo,
  NivelEscolaridade,
  PosGraduacaoConcluida,
  TipoEnsinoMedio,
  TipoVinculoInstituicao,
} from '../entities/enums/pessoa.enum';

export class ColaboradorDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    enum: NivelEscolaridade,
  })
  @IsNotEmpty()
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

  @ApiProperty({ enum: Cargo })
  @IsEnum(Cargo)
  cargo: Cargo;

  @ApiProperty({ enum: TipoVinculoInstituicao, nullable: true })
  @IsOptional()
  @IsEnum(TipoVinculoInstituicao)
  tipoVinculo: TipoVinculoInstituicao | null;

  @ApiPropertyOptional({ description: 'ID da instituição vinculada' })
  @IsOptional()
  @IsString()
  instituicaoId?: string;

  @ApiPropertyOptional({ description: 'Nome da instituição vinculada' })
  @IsOptional()
  @IsString()
  instituicaoNome?: string;
}
