import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateContatoDto } from '../../base/dto/create-contato.dto';
import { CreateEnderecoDto } from '../../base/dto/create-endereco.dto';
import { LocalAtendimentoDto } from '../../local-atendimento/dto/local-atendimento.dto';
import { CreateSecretariaMunicipalEtapaDto } from '../../secretaria-municipal-etapa/dto/create-secretaria-municipal-etapa.dto';
import { SecretariaMunicipalDto } from './secretaria-municipal.dto';

export class CreateSecretariaMunicipalDto extends SecretariaMunicipalDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco!: CreateEnderecoDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateContatoDto)
  contato!: CreateContatoDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSecretariaMunicipalEtapaDto)
  secretariaMunicipalEtapas!: CreateSecretariaMunicipalEtapaDto[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocalAtendimentoDto)
  locaisAtendimentos!: LocalAtendimentoDto[];
}
