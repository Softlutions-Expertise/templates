import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ObjectIDDto } from '../../../helpers/dtos/object-id.dto';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { GerenciaAgendamentoEntity } from '../entities/gerencia-agendamento.entity';

export type IDeactivateDiasNaoUteisTargetFeriado = {
  kind: 'feriado';
  gerenciaAgendamento: ObjectUUIDDto;
  feriado: ObjectUUIDDto;
};

export type IDeactivateDiasNaoUteisTargetDiaNaoUtil = {
  kind: 'diaNaoUtil';
  gerenciaAgendamento: ObjectUUIDDto;
  diaNaoUtil: ObjectIDDto;
};

export type IDeactivateDiasNaoUteisTarget =
  | IDeactivateDiasNaoUteisTargetFeriado
  | IDeactivateDiasNaoUteisTargetDiaNaoUtil;

export class DeactivateManyDiasNaoUteisDto {
  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [GerenciaAgendamentoEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  gerenciaAgendamento: ObjectUUIDDto;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObjectUUIDDto)
  feriados: ObjectUUIDDto[];

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObjectIDDto)
  diasNaoUteis: ObjectIDDto[];
}
