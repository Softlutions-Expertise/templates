import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetDoc } from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { MapsService } from './maps.service';

@ApiTags('Maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('colaboradores/cidade/:cidadeId')
  @GetDoc(
    'Colaboradores no Mapa',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  findAllColaboradoresByCidade(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('cidadeId') cidadeId: string,
  ) {
    return this.mapsService.findAllColaboradoresByCidade(acessoControl, cidadeId);
  }

  @Get('colaboradores')
  @GetDoc(
    'Colaboradores no Mapa - Todas as Cidades',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  findAllColaboradoresWithCoordinates(
    @ResolveAcessoControl() acessoControl: AcessoControl,
  ) {
    return this.mapsService.findAllColaboradoresWithCoordinates(acessoControl);
  }
}
