import { IntersectionType } from '@nestjs/swagger';
import { UpdatePessoaDto } from './update-pessoa.dto';
import { FuncionarioDto } from './funcionario.dto';
import { UpdateUsuarioDto } from './usuario-uptade.dto.';

export class UpdateFuncionarioIntersectionDto extends IntersectionType(
  FuncionarioDto,
  UpdatePessoaDto,
  UpdateUsuarioDto,
) {}
