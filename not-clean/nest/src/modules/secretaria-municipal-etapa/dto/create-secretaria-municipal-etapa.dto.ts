import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ObjectIDDto } from '../../../helpers/dtos/object-id.dto';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { EtapaEntity } from '../../etapa/etapa.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';

export class CreateSecretariaMunicipalEtapaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  idadeInicial: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  idadeFinal: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  ativa: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  apelido: string;

  @ApiProperty()
  @IsOptional() //Como o campo só será criado na etapa de criação da secretaria-municipal, ele é opcional
  @Validate(EntityExist, [SecretariaMunicipalEntity, 'id', 'id'])
  @Type(() => ObjectUUIDDto)
  secretariaMunicipal!: SecretariaMunicipalEntity;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(EntityExist, [EtapaEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectIDDto)
  etapa!: EtapaEntity;
}
