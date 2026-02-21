import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateEnderecoDto } from '../../base/dto/create-endereco.dto';
import { CreateDocumentoDto } from '../../documento/dto/create-documento.dto';
import { CreateHorarioFuncionamentoDto } from '../../horario-funcionamento/dto/create-horario-funcionamento.dto';
import { EscolaDto } from './escola.dto';

export class UpdateEscolaDto extends PartialType(
  OmitType(EscolaDto, ['codigoInep'] as const),
) {
  @ApiProperty()
  @IsNumberString()
  @MaxLength(8)
  codigoInep!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco!: CreateEnderecoDto;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentoDto)
  documentos?: CreateDocumentoDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateHorarioFuncionamentoDto)
  horariosFuncionamento?: CreateHorarioFuncionamentoDto[];
}
