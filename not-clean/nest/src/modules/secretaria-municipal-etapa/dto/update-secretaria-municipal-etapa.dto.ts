import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { SecretariaMunicipalEtapaEntity } from '../secretaria-municipal-etapa.entity';
import { CreateSecretariaMunicipalEtapaDto } from './create-secretaria-municipal-etapa.dto';

export class UpdateSecretariaMunicipalEtapaDto extends PartialType(
  CreateSecretariaMunicipalEtapaDto,
) {
  @ApiProperty()
  @IsOptional() // Tem que ser opicional para os casos do update onde pode ter também novs etapas
  @Validate(EntityExist, [SecretariaMunicipalEtapaEntity, 'id', 'id'])
  @Type(() => ObjectUUIDDto)
  id: string;
}
