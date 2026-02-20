import { IntersectionType } from '@nestjs/swagger';
import { FuncionarioDto } from './funcionario.dto';
import { CreatePessoaDto } from './create-pessoa.dto';
import { CreateUsuarioDto } from './create-usuario.dto';

export class CreateFuncionarioDto extends IntersectionType(
  FuncionarioDto,
  CreatePessoaDto,
  CreateUsuarioDto,
) {}
