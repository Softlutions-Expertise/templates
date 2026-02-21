import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { GerenciaAgendamentoEntity } from '../entities/gerencia-agendamento.entity';
export class CreateDiasNaoUteisDto {
  @ApiProperty()
  @IsNotEmpty()
  dataFeriado: Date;

  @ApiProperty()
  @IsNotEmpty()
  tituloFeriado: string;

  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [GerenciaAgendamentoEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  gerenciaAgendamento: GerenciaAgendamentoEntity;
}
