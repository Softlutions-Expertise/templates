import { IntersectionType } from '@nestjs/swagger';
import { CreateFuncionarioDto } from './create-funcionario.dto';
import { CreateUsuarioDto } from './create-usuario.dto';

export class CreateFuncionarioUsuarioDto extends IntersectionType(
  CreateUsuarioDto,
  CreateFuncionarioDto,
) {}
