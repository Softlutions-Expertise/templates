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
import { Unique } from '../../../helpers/validators/unique';
import { LocalAtendimentoEntity } from '../../local-atendimento/local-atendimento.entity';
import { GerenciaAgendamentoEntity } from '../entities/gerencia-agendamento.entity';

export class CreateGerenciaAgendamentoDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  intervaloEntrevista: string;

  @ApiProperty()
  @IsNotEmpty()
  numeroAtendimentoIntervalo: number;

  @ApiProperty()
  @IsNotEmpty()
  horarioInicioMatutino: string;

  @ApiProperty()
  @IsNotEmpty()
  horarioFimMatutino: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  horarioInicioVespertino: string;

  @ApiProperty()
  @IsNotEmpty()
  horarioFimVespertino: string;

  //

  @ApiProperty()
  @IsBoolean()
  disponibilidadeDomingo: boolean;

  @ApiProperty()
  @IsBoolean()
  disponibilidadeSegunda: boolean;

  @ApiProperty()
  @IsBoolean()
  disponibilidadeTerca: boolean;

  @ApiProperty()
  @IsBoolean()
  disponibilidadeQuarta: boolean;

  @ApiProperty()
  @IsBoolean()
  disponibilidadeQuinta: boolean;

  @ApiProperty()
  @IsBoolean()
  disponibilidadeSexta: boolean;

  @ApiProperty()
  @IsBoolean()
  disponibilidadeSabado: boolean;

  //

  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [LocalAtendimentoEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  @Validate(Unique, [GerenciaAgendamentoEntity])
  localAtendimento: LocalAtendimentoEntity;
}
