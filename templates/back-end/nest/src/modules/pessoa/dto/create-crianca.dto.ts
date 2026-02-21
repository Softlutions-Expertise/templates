import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Validate,
  ValidateNested,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';
import { Unique } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IsCPF } from '../../../helpers/validators/cpf-cnpj.validator';
import { CreateContatoDto } from '../../base/dto/create-contato.dto';
import { CreateEnderecoDto } from '../../base/dto/create-endereco.dto';
import { CriancaEntity } from '../entities/crianca.entity';
import { Sexo } from '../entities/enums/pessoa.enum';
import { CreateResponsavelDto } from './create-responsavel.dto';

export class CreateCriancaDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  @Validate(Unique, [CriancaEntity])
  @IsCPF()
  cpf: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Sexo)
  sexo: Sexo;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dataNascimento: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  numeroSUS: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  paisOrigem: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  registroNacionalEstrangeiro: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  protocoloRefugio: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco: CreateEnderecoDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  numeroUnidadeConsumidora: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  numeroUnidadeMatriculaIPTU: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateContatoDto)
  contato: CreateContatoDto;

  @ApiProperty()
  @IsNotEmpty()
  responsavel: CreateResponsavelDto;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  responsavel2?: CreateResponsavelDto;
}
