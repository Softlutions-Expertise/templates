import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateEnderecoDto } from '../../base/dto/create-endereco.dto';
import { CreateDocumentoDto } from '../../documento/dto/create-documento.dto';
import { CreateHorarioFuncionamentoDto } from '../../horario-funcionamento/dto/create-horario-funcionamento.dto';
import { EscolaDto } from './escola.dto';

export class CreateEscolaDto extends EscolaDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco!: CreateEnderecoDto;

  @ApiPropertyOptional({ type: [CreateDocumentoDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentoDto)
  documentos?: CreateDocumentoDto[];

  @ApiPropertyOptional({ type: [CreateHorarioFuncionamentoDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateHorarioFuncionamentoDto)
  horariosFuncionamento?: CreateHorarioFuncionamentoDto[];
}
