import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
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
import { RegistroVagasEntity } from '../entities/registro-vagas.entity';
import { TurmaEntity } from '../entities/turma.entity';

export class CreateVagasDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
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
  @IsBoolean()
  ativa: boolean;

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
  @IsNotEmpty()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [RegistroVagasEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  registroVagas: RegistroVagasEntity;
}
