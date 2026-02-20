import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaVagaDto } from './create-reserva-vaga.dto';

export class UpdateReservaVagaDto extends PartialType(CreateReservaVagaDto) {}
