import { PartialType } from '@nestjs/swagger';
import { UpdatePessoaIntersectionDto } from './update-pessoa-intersection.dto';

export class UpdatePessoaDto extends PartialType(UpdatePessoaIntersectionDto) {}
