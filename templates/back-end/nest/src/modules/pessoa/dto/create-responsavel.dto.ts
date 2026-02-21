import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { IsCPF } from '../../../helpers/validators/cpf-cnpj.validator';
import { Sexo } from '../entities/enums/pessoa.enum';
import { LimparCpf } from '../../../helpers/functions/Mask';

export class CreateResponsavelDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @Transform((ctx) => LimparCpf(ctx.value))
  @IsNotEmpty()
  @IsCPF()
  cpfRes: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nomeRes: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dataNascimentoRes: string;

  @ApiProperty()
  @IsNotEmpty()
  nacionalidadeRes: string;

  @ApiPropertyOptional()
  @IsOptional()
  protocoloRefugioRes: string;

  @ApiPropertyOptional()
  @IsOptional()
  registroNacionalEstrangeiroRes: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Sexo)
  sexoRes: Sexo;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  parentesco: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  estadoCivil: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profissao: string;

  @ApiProperty()
  @IsNotEmpty()
  falecido: boolean;

  @ApiProperty()
  @IsNotEmpty()
  resideCrianca: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  cepLocalTrabalhoResponsavel: string;

  @ApiProperty()
  @IsNotEmpty()
  exerceAtividadeProfissional: boolean;
}
