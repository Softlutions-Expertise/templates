import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ObjectIDDto } from '../../../helpers/dtos/object-id.dto';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { EscolaEntity } from '../../escola/entities/escola.entity';
import { EtapaEntity } from '../../etapa/etapa.entity';

export class FilaDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  fila: string;

  @ApiProperty()
  @IsString()
  turno: string;

  @ApiProperty()
  @IsNotEmpty()
  anoLetivo: string;

  @ApiPropertyOptional()
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  updatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  deletedAt?: Date;

  @Validate(EntityExist, [EscolaEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  escola: EscolaEntity;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(EntityExist, [EtapaEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectIDDto)
  etapa: EtapaEntity;
}
