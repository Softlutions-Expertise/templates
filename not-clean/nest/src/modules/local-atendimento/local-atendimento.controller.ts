import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { GetDoc } from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { LocalAtendimentoEntity } from './local-atendimento.entity';
import { LocalAtendimentoService } from './local-atendimento.service';

@ApiTags('Local de Atendimento')
@Controller('local-atendimento')
export class LocalAtendimentoController {
  constructor(
    private readonly localAtendimentoService: LocalAtendimentoService,
  ) {}

  @Get(':id')
  @GetDoc(
    'Local de Atendimento',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
  )
  findOne(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ): Promise<LocalAtendimentoEntity> {
    return this.localAtendimentoService.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc(
    'Local de Atendimento',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<LocalAtendimentoEntity>> {
    return this.localAtendimentoService.findAll(acessoControl, query);
  }
}
