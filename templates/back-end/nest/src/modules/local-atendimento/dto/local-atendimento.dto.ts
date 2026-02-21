import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { CreateContatoDto } from '../../base/dto/create-contato.dto';
import { CreateEnderecoDto } from '../../base/dto/create-endereco.dto';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';

export class LocalAtendimentoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  ativo: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco: CreateEnderecoDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateContatoDto)
  contato: CreateContatoDto;

  @ApiProperty()
  @IsOptional() //Como o campo só será criado na etapa de criação da secretaria-municipal, ele é opcional
  @Validate(EntityExist, [SecretariaMunicipalEntity, 'id', 'id'])
  @Type(() => ObjectUUIDDto)
  secretariaMunicipal: SecretariaMunicipalEntity;
}
