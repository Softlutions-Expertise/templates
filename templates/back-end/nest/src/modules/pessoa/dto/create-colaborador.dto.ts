import { IntersectionType } from '@nestjs/swagger';
import { ColaboradorDto } from './colaborador.dto';
import { CreatePessoaDto } from './create-pessoa.dto';
import { CreateUsuarioDto } from './create-usuario.dto';

export class CreateColaboradorDto extends IntersectionType(
  ColaboradorDto,
  CreatePessoaDto,
  CreateUsuarioDto,
) {}
