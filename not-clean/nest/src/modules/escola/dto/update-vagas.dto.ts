import { PartialType } from '@nestjs/swagger';
import { CreateVagasDto } from './create-vagas.dto';

export class UpdateVagasDto extends PartialType(CreateVagasDto) {}
