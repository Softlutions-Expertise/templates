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
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';

export class GerenciaAgendamentoUpdateCheckDto {
  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [SecretariaMunicipalEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  secretariaMunicipal: SecretariaMunicipalEntity;
}
