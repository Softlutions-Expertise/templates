import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetDoc } from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { SituacaoFuncionamento } from '../escola/entities/enums/escola.enum';
import { MapsService } from './maps.service';

@ApiTags('Maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) { }

  @Get('escolas/cidade/:idCidade')
  @GetDoc(
    'Escola',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
    ['situacaoFuncionamento'],
  )
  findAllEscolasByCidade(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('idCidade') idCidade: string,
    @Query('situacaoFuncionamento')
    situacaoFuncionamento?: SituacaoFuncionamento,
  ) {
    return this.mapsService.findAllEscolasByCidade(
      acessoControl,
      idCidade,
      situacaoFuncionamento,
    );
  }

  @Get('criancas/cidade/:idCidade')
  @GetDoc(
    'Crianca',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
  ) findAllCriancaByCidade(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('idCidade') idCidade: string,
  ) {
    return this.mapsService.findAllCriancaByCidade(
      acessoControl,
      idCidade,
    );
  }
}
