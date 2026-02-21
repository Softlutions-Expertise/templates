import { PartialType } from '@nestjs/swagger';
import { CreateResponsavelDto } from './create-responsavel.dto';

export class UpdateResponsavelDto extends PartialType(
  CreateResponsavelDto,
) {}
