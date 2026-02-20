import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
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
import { EtapaEntity } from '../../etapa/etapa.entity';
import { EscolaEntity } from '../entities/escola.entity';

export class CreateTurmaDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsNotEmpty()
  turno: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  periodoInicial: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  periodoFinal: string;

  @ApiProperty()
  @IsNotEmpty()
  horarioInicial: string;

  @ApiProperty()
  @IsNotEmpty()
  horarioFinal: string;

  @ApiProperty()
  @IsNotEmpty()
  diasSemana: Dias[];

  @ApiProperty()
  @IsNotEmpty()
  tipoTurma: string;

  @ApiProperty()
  @IsNotEmpty()
  situacao: boolean;

  @ApiProperty()
  @IsNotEmpty()
  anoLetivo: string;

  @ApiProperty({ type: ObjectIDDto })
  @IsNotEmpty()
  @Validate(EntityExist, [EtapaEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectIDDto)
  etapa: EtapaEntity;

  @ApiProperty({ type: ObjectUUIDDto })
  @IsNotEmpty()
  @Validate(EntityExist, [EscolaEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  escola: EscolaEntity;
}

export class Dias {
  @ApiProperty()
  @IsNotEmpty()
  dia: string;
}
