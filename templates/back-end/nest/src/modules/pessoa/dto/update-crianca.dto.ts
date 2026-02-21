import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateContatoDto } from '../../base/dto/update-contato.dto';
import { UpdateEnderecoDto } from '../../base/dto/update-endereco.dto';
import { CreateCriancaDto } from './create-crianca.dto';
import { UpdateResponsavelDto } from './update-responsavel.dto';

export class UpdateCriancaDto extends PartialType(
  OmitType(CreateCriancaDto, [
    'endereco',
    'contato',
    'responsavel',
    'responsavel2',
  ] as const),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEnderecoDto)
  endereco: UpdateEnderecoDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContatoDto)
  contato: UpdateContatoDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateResponsavelDto)
  responsavel: UpdateResponsavelDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateResponsavelDto)
  responsavel2?: UpdateResponsavelDto;
}
