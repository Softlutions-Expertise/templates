import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { LocalAtendimentoEntity } from '../../local-atendimento/local-atendimento.entity';
import { CreateGerenciaAgendamentoDto } from './create-gerencia-agendamento.dto';



export class UpdateGerenciaAgendamentoDto extends PartialType(
  CreateGerenciaAgendamentoDto,
) {
  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
  
  @ApiProperty()
  @IsOptional()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [LocalAtendimentoEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  localAtendimento?: LocalAtendimentoEntity;
}
