import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { GetDoc } from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { EtapaEntity } from './etapa.entity';
import { EtapaService } from './etapa.service';

@ApiTags('Etapa')
@Controller('etapa')
export class EtapaController {
  constructor(private readonly etapaService: EtapaService) {}

  @Get()
  @GetDoc(
    'Etapa',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
    [
      'filter.secretariaMunicipalEtapas.secretariaMunicipal.id',
      'filter.secretariaMunicipalEtapas.ativa',
    ],
  )
  async findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<EtapaEntity>> {
    return this.etapaService.findAll(acessoControl, query);
  }

  @Get('/secretaria-municipal/:secretariaMunicipalId')
  @GetDoc(
    'Etapa',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
    ['dataNascimento', 'anoLetivo'],
  )
  async getEtapasForSecretaria(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('secretariaMunicipalId') secretariaMunicipalId: string,
    @Query('dataNascimento') dataNascimento: string,
    @Query('anoLetivo') anoLetivo: string,
  ): Promise<EtapaEntity> {
    return this.etapaService.findEtapaBySecretariaMunicipalIDAndDataNascimento(
      acessoControl,
      secretariaMunicipalId,
      dataNascimento,
      anoLetivo,
    );
  }

  @Get('/vagas')
  @GetDoc(
    'Etapa',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
    ['dataNascimento', 'secretariaMunicipalId', 'cidadeId'],
  )
  async getVagasByEtapa(
    @Query('secretariaMunicipalId') secretariaMunicipalId: string,
    @Query('dataNascimento') dataNascimento: string,
    @Query('cidadeId') cidadeId: number,
    @Query('anoLetivo') anoLetivo: string,
  ): Promise<any> {
    return this.etapaService.findVagasByEtapa(
      cidadeId,
      secretariaMunicipalId,
      dataNascimento,
      anoLetivo
    );
  }
}
