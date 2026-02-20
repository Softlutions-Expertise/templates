import { IntersectionType } from '@nestjs/swagger';
import { CreatePessoaDto } from './create-pessoa.dto';
import { UpdateEnderecoProprietyDto } from '../../base/dto/update-endereco-propriety.dto';

export class UpdatePessoaIntersectionDto extends IntersectionType(
  CreatePessoaDto,
  UpdateEnderecoProprietyDto,
) {}
