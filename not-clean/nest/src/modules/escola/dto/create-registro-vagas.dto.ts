import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { EscolaEntity } from '../entities/escola.entity';
import { TurmaEntity } from '../entities/turma.entity';

export class CreateRegistroVagasDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dataHoraVaga: string;

  @ApiProperty({ type: () => FuncionarioEntity })
  @Type(() => FuncionarioEntity)
  @IsObject()
  servidor: FuncionarioEntity;

  @ApiProperty()
  @IsString()
  anoLetivo: string;

  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [EscolaEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  escola: EscolaEntity;

  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [TurmaEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  turma: TurmaEntity;

  @ApiProperty()
  @IsNumber()
  quantidadeVagas: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vagas?: string;
}
