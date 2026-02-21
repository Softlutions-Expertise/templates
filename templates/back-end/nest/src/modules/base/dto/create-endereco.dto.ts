import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ObjectIDDto } from '../../../helpers/dtos/object-id.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { CidadeEntity } from '../entities/cidade.entity';
import { LocalizacaoDiferencia, Zona } from '../entities/enums/endereco.enum';
import { CreateCidadeDto } from './create-cidade.dto';
import { CreateDistritoDto } from './create-distrito.dto';
import { CreateSubdistritoDto } from './create-subdistrito.dto';

export class CreateEnderecoDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    minLength: 3,
  })
  @IsString()
  @Length(3)
  @IsOptional()
  logradouro: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  numero: number;

  @ApiProperty({
    minLength: 2,
  })
  @IsString()
  @Length(2)
  @IsOptional()
  bairro: string;

  @ApiPropertyOptional({
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  complemento: string;

  @ApiPropertyOptional({
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @Length(3)
  pontoReferencia: string;

  @ApiProperty({
    minLength: 9,
    maxLength: 9,
  })
  @IsString()
  @IsOptional()
  cep: string;

  @ApiProperty({
    enum: LocalizacaoDiferencia,
  })
  @IsEnum(LocalizacaoDiferencia)
  @IsString()
  @IsOptional()
  localizacaoDiferenciada: LocalizacaoDiferencia;

  @ApiProperty({
    enum: Zona,
  })
  @IsEnum(Zona)
  @IsString()
  @IsOptional()
  zona: Zona;

  @ApiProperty({ type: ObjectIDDto })
  @Validate(EntityExist, [CidadeEntity, 'id', 'id'])
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ObjectIDDto)
  cidade: CreateCidadeDto;

  @ApiPropertyOptional({ type: ObjectIDDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ObjectIDDto)
  distrito: CreateDistritoDto;

  @ApiPropertyOptional({ type: ObjectIDDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ObjectIDDto)
  subdistrito: CreateSubdistritoDto;

  @ApiPropertyOptional({
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @Length(3)
  latitude: string;

  @ApiPropertyOptional({
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @Length(3)
  longitude: string;

  @ApiPropertyOptional({
    nullable: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  novo?: boolean;
}
