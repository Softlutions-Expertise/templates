import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CreateEnderecoDto } from '../../base/dto/create-endereco.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { LimparCpf } from '../../../helpers/functions/Mask';
import { IsCPF } from '../../../helpers/validators/cpf-cnpj.validator';
import { Unique } from '../../../helpers/validators/unique';
import { CreateContatoDto } from '../../base/dto/create-contato.dto';
import { Nacionalidade, Raca, Sexo } from '../entities/enums/pessoa.enum';
import { PessoaEntity } from '../entities/pessoa.entity';

export class CreatePessoaDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(5)
  nome: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  foto: string;

  @ApiProperty()
  @Transform((ctx) => LimparCpf(ctx.value))
  @IsCPF({})
  @Validate(Unique, [PessoaEntity])
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  rg: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3)
  orgaoExpRg: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dataNascimento: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Sexo)
  sexo: Sexo;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Raca)
  raca: Raca;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Nacionalidade)
  nacionalidade: Nacionalidade;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1)
  paisNascimento: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  @Transform(({ value }) => value.toUpperCase())
  ufNascimento: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2)
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1))
  municipioNascimento: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(5)
  municipioNascimentoId: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco: CreateEnderecoDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateContatoDto)
  contato: CreateContatoDto;
}
