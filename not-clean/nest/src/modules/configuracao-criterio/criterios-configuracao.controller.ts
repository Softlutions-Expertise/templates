import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetDoc, PatchDoc } from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { CriteriosConfiguracaoService } from './criterios-configuracao.service';
import { ConfigurarCriteriosDto } from './dtos/ConfigurarCriteriosDto';

@ApiTags('Secretaria Municipal: Configuração de Critérios')
@Controller('secretaria-municipal/:secretariaMunicipalId/criterios')
export class CriteriosConfiguracaoController {
  constructor(
    private readonly configuracaoCriterioService: CriteriosConfiguracaoService,
  ) {}

  @Get('/configuracao')
  @GetDoc(
    'Secretaria Municipal: Configuração de Critérios',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
  )
  async consultarConfiguracaoAtual(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('secretariaMunicipalId') secretariaMunicipalId: string,
  ) {
    return this.configuracaoCriterioService.consultaDefinicoesAtual(
      acessoControl,
      secretariaMunicipalId,
    );
  }

  @Put('/configuracao')
  @PatchDoc(
    'Secretaria Municipal: Configuração de Critérios',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
    ConfigurarCriteriosDto,
  )
  async configurarCriterios(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('secretariaMunicipalId') secretariaMunicipalId: string,
    @Body() dto: ConfigurarCriteriosDto,
  ) {
    return this.configuracaoCriterioService.configurarCriterios(
      acessoControl,
      secretariaMunicipalId,
      dto,
    );
  }
}
