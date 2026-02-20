import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ObjectUUIDDto } from '../../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../../helpers/validators/entity-exist';
import { FuncionarioEntity } from '../../../pessoa/entities/funcionario.entity';

export class CreateIntegrationAccessTokenDto {
  @ApiProperty()
  @IsString()
  descricao: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  validoAte: Date | null;

  @IsBoolean()
  @ApiProperty()
  ativo: boolean;

  //

  @ApiProperty({ type: ObjectUUIDDto })
  @Validate(EntityExist, [FuncionarioEntity, 'id', 'id'])
  @IsOptional()
  @ValidateNested()
  @Type(() => ObjectUUIDDto)
  herdaPermissoesDeFuncionario: FuncionarioEntity | null;
}
