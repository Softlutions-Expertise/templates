import { PartialType } from '@nestjs/swagger';
import { CreateRegistrarContatoDto } from './create-registrar-contato.dto';

export class UpdateRegistrarContatoDto extends PartialType(
  CreateRegistrarContatoDto,
) {}
