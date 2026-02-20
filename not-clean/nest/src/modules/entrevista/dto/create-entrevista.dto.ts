import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ObjectIDDto } from '../../../helpers/dtos/object-id.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { EscolaEntity } from '../../escola/entities/escola.entity';
import { EtapaEntity } from '../../etapa/etapa.entity';
import { CriancaEntity } from '../../pessoa/entities/crianca.entity';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import { Criterios } from './enums/enum';

export class CreateEntrevistaDto {
  @ApiPropertyOptional()
  @IsOptional()
  readonly id?: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dataEntrevista: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  horarioEntrevista: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  preferenciaTurno: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  preferenciaTurno2: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tipoResponsavel: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nomeResponsavel: string;

  @ApiProperty()
  elegivelParaFila: boolean;

  @ApiProperty()
  elegivelParaFila2: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cpfResponsavel: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dataNascimentoResponsavel: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sexoResponsavel: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  estadoCivilResponsavel: string;

  @ApiProperty()
  @IsBoolean()
  possuiIrmaoNaUnidade: boolean;

  @ApiProperty()
  @IsOptional()
  nomeIrmao: string;

  @ApiProperty()
  @IsOptional()
  cpfIrmao: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  membrosEderecoCrianca: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  membrosContribuintesRenda: number;

  @ApiProperty()
  @IsDecimal()
  @IsOptional()
  valorRendaFamiliar: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  observacoesFamilia: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  parentescoResponsavel: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  observacoesCentralVagas: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, {
    message: 'O campo Ano Letivo deve estar no padrão "AAAA"',
  })
  anoLetivo: string;

  @ApiProperty({ type: () => EscolaEntity })
  @Validate(EntityExist, [EscolaEntity, 'id', 'id'])
  @Type(() => EscolaEntity)
  preferenciaUnidade: EscolaEntity;

  @ApiProperty({ type: () => EscolaEntity })
  @Validate(EntityExist, [EscolaEntity, 'id', 'id'])
  @IsOptional()
  @Type(() => EscolaEntity)
  preferenciaUnidade2: EscolaEntity;

  @ApiProperty()
  @IsOptional()
  @ApiProperty({ type: () => EscolaEntity })
  @Validate(EntityExist, [EscolaEntity, 'id', 'id'])
  @IsOptional()
  @Type(() => EscolaEntity)
  unidadeEscolarIrmao: EscolaEntity;

  @ApiProperty()
  @IsArray()
  criterios: Criterios[];

  @ApiProperty({ type: () => CriancaEntity })
  @Validate(EntityExist, [CriancaEntity, 'id', 'id'])
  // a validação de 1 criaça por entrevista está ocorrendo no EntrevistaService
  @Type(() => CriancaEntity)
  @IsObject()
  crianca: CriancaEntity;

  @ApiProperty({ type: () => FuncionarioEntity })
  @Validate(EntityExist, [FuncionarioEntity, 'id', 'id'])
  @Type(() => FuncionarioEntity)
  @IsObject()
  entrevistador: FuncionarioEntity;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => SecretariaMunicipalEntity)
  @IsObject()
  secretariaMunicipal: SecretariaMunicipalEntity;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(EntityExist, [EtapaEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectIDDto)
  etapa: EtapaEntity;
}
