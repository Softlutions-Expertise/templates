import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { Unique } from '../../../helpers/validators/unique';
import { EntrevistaEntity } from '../../entrevista/entities/entrevista.entity';
import { VagaEntity } from '../../escola/entities/vaga.entity';
import { CriancaEntity } from '../../pessoa/entities/crianca.entity';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { ReservaVagaEntity } from '../entities/reserva-vaga.entity';

export class CreateReservaVagaDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @IsNotEmpty()
  @Type(() => ObjectUUIDDto)
  @Validate(EntityExist, [FuncionarioEntity, 'id', 'id'])
  @IsObject()
  funcionario: FuncionarioEntity;

  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @IsNotEmpty()
  @Type(() => ObjectUUIDDto)
  @Validate(EntityExist, [VagaEntity, 'id', 'id'])
  @Validate(Unique, [ReservaVagaEntity])
  @IsObject()
  vaga: VagaEntity;

  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @IsNotEmpty()
  @Type(() => ObjectUUIDDto)
  @Validate(EntityExist, [CriancaEntity, 'id', 'id'])
  @IsObject()
  crianca: CriancaEntity;

  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @IsNotEmpty()
  @Type(() => ObjectUUIDDto)
  @Validate(EntityExist, [EntrevistaEntity, 'id', 'id'])
  @Validate(Unique, [ReservaVagaEntity])
  @IsObject()
  entrevista: EntrevistaEntity;
}
