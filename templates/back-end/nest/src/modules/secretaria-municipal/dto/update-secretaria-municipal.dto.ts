import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UpdateContatoDto } from '../../base/dto/update-contato.dto';
import { UpdateEnderecoDto } from '../../base/dto/update-endereco.dto';
import { LocalAtendimentoDto } from '../../local-atendimento/dto/local-atendimento.dto';
import { UpdateSecretariaMunicipalEtapaDto } from '../../secretaria-municipal-etapa/dto/update-secretaria-municipal-etapa.dto';
import { SecretariaMunicipalDto } from './secretaria-municipal.dto';

export class UpdateSecretariaMunicipalDto extends PartialType(
  SecretariaMunicipalDto,
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
  contato!: UpdateContatoDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateSecretariaMunicipalEtapaDto)
  secretariaMunicipalEtapas!: UpdateSecretariaMunicipalEtapaDto[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocalAtendimentoDto)
  locaisAtendimentos!: LocalAtendimentoDto[];
}
