import { PartialType } from '@nestjs/swagger';
import { CreateEntrevistaDto } from './create-entrevista.dto';

export class UpdateEntrevistaDto extends PartialType(CreateEntrevistaDto) {}
