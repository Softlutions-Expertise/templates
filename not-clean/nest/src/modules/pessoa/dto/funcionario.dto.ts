import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { EscolaEntity } from '../../escola/entities/escola.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import {
  Cargo,
  NivelEscolaridade,
  PosGraduacaoConcluida,
  TipoEnsinoMedio,
  TipoVinculoInstituicao,
} from '../entities/enums/pessoa.enum';

export class FuncionarioDto {
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

  @Validate(EntityExist, [EscolaEntity, 'id', 'id'], { each: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ObjectUUIDDto)
  unidadesEscolares?: EscolaEntity[];

  @Validate(EntityExist, [SecretariaMunicipalEntity, 'id', 'id'], { each: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ObjectUUIDDto)
  secretarias?: SecretariaMunicipalEntity[];
}
