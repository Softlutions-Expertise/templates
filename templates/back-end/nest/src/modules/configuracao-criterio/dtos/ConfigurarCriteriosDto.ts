import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Column, Unique } from 'typeorm';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { CriteriosEntity } from '../../entrevista/entities/criterios.entity';

export class ConfigurarCriteriosDtoItem {
  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [CriteriosEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  @Validate(Unique, [CriteriosEntity])
  criterio: CriteriosEntity;

  @Column({ type: 'bool' })
  @IsBoolean()
  exigirComprovacao!: boolean;
}

export class ConfigurarCriteriosDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfigurarCriteriosDtoItem)
  definidos?: ConfigurarCriteriosDtoItem[];

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfigurarCriteriosDtoItem)
  nota_c: ConfigurarCriteriosDtoItem[];

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfigurarCriteriosDtoItem)
  nota_h: ConfigurarCriteriosDtoItem[];
}
