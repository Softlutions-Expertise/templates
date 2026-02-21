import { Controller, Get, Query, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { format } from 'date-fns';
import { GetDoc } from '../../../helpers/decorators/swagger.decorator';
import { Roles } from '../../../helpers/enums/role.enum';
import { NeedsAuth } from '../../../infrastructure';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators';
import { PresentationService } from './presentation.service';

type IMaybeString = string | null | undefined;

@ApiTags('Dashboard / Apresentação')
@Controller('/dashboard/presentation')
export class PresentationController {
  constructor(private presentationService: PresentationService) {}

  @Get('counters/agendamentos')
  @NeedsAuth()
  @GetDoc(
    'Dashboard / Apresentação / Contadores do Perfil / Agendamentos',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['secretariaMunicipal.id', 'escola.id', 'localAtendimento.id'],
  )
  getProfileCountersAgendamentos(
    //
    @ResolveAcessoControl()
    acessoControl: AcessoControl,
    //
    @Query('secretariaMunicipal.id')
    secretariaMunicipalId?: IMaybeString,
    //
    @Query('escola.id')
    escolaId?: IMaybeString,
    //
    @Query('localAtendimento.id')
    localAtendimentoId?: IMaybeString,
  ) {
    return this.presentationService.getCountersProfileAgendamentos(
      acessoControl,
      secretariaMunicipalId,
      escolaId,
      localAtendimentoId,
    );
  }

  @Get('counters/vagas')
  @NeedsAuth()
  @GetDoc(
    'Dashboard / Apresentação / Contadores do Perfil / Vagas',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['secretariaMunicipal.id', 'escola.id'],
  )
  getProfileCountersVagas(
    //
    @ResolveAcessoControl()
    acessoControl: AcessoControl,
    //
    @Query('secretariaMunicipal.id')
    secretariaMunicipalId?: IMaybeString,
    //
    @Query('escola.id')
    escolaId?: IMaybeString,
  ) {
    return this.presentationService.getCountersProfileVagas(
      acessoControl,
      secretariaMunicipalId,
      escolaId,
    );
  }

  @Get('counters/reservas')
  @NeedsAuth()
  @GetDoc(
    'Dashboard / Apresentação / Contadores do Perfil / Reservas de Vagas',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['secretariaMunicipal.id', 'escola.id'],
  )
  getProfileCountersReservas(
    //
    @ResolveAcessoControl()
    acessoControl: AcessoControl,
    //
    @Query('secretariaMunicipal.id')
    secretariaMunicipalId?: IMaybeString,
    //
    @Query('escola.id')
    escolaId?: IMaybeString,
  ) {
    return this.presentationService.getCountersProfileReservas(
      acessoControl,
      secretariaMunicipalId,
      escolaId,
    );
  }

  @Get('counters/filas-de-espera')
  @NeedsAuth()
  @GetDoc(
    'Dashboard / Apresentação / Contadores do Perfil / Filas de Espera',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['secretariaMunicipal.id', 'escola.id'],
  )
  getProfileCountersFilasDeEspera(
    //
    @ResolveAcessoControl()
    acessoControl: AcessoControl,
    //
    @Query('secretariaMunicipal.id')
    secretariaMunicipalId?: IMaybeString,
    //
    @Query('escola.id')
    escolaId?: IMaybeString,
  ) {
    return this.presentationService.getCountersProfileFilasDeEspera(
      acessoControl,
      secretariaMunicipalId,
      escolaId,
    );
  }

  // =========================================

  @Get('fila-de-espera/criancas-fila')
  @NeedsAuth()
  @GetDoc(
    'Dashboard / Apresentação / Fila de Espera / Crianças na Fila',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    [
      'secretariaMunicipal.id',
      'escola.id',

      {
        name: 'page',
        type: Number,
        required: false,
      },

      {
        name: 'limit',
        type: Number,
        required: false,
      },
    ],
  )
  getPresentationFilaPosicoesVinculadas(
    //
    @ResolveAcessoControl()
    acessoControl: AcessoControl,
    //
    @Query('page')
    page?: number | string,
    //
    @Query('limit')
    limit?: number | string,
    //
    @Query('secretariaMunicipal.id')
    secretariaMunicipalId?: IMaybeString,
    //
    @Query('escola.id')
    escolaId?: IMaybeString,
    //
  ) {
    const requestQueueController =
      this.presentationService.createRequestQueueController();

    return this.presentationService.getPresentationFilaPosicoesVinculadasProfile(
      requestQueueController,
      acessoControl,
      //
      secretariaMunicipalId,
      escolaId,
      //
      page,
      limit,
    );
  }

  @Get('fila-de-espera/criancas-fila-csv')
  @NeedsAuth()
  @GetDoc(
    'Dashboard / Apresentação / Fila de Espera / Crianças na Fila (CSV)',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['secretariaMunicipal.id', 'escola.id'],
  )
  async getPresentationFilaPosicoesVinculadasCsv(
    //
    @ResolveAcessoControl()
    acessoControl: AcessoControl,
    //
    @Query('secretariaMunicipal.id')
    secretariaMunicipalId?: IMaybeString,
    //
    @Query('escola.id')
    escolaId?: IMaybeString,
    //
  ) {
    const requestQueueController =
      this.presentationService.createRequestQueueController();

    const csv =
      await this.presentationService.getPresentationFilaPosicoesVinculadasCsvProfile(
        requestQueueController,
        acessoControl,
        secretariaMunicipalId,
        escolaId,
      );

    const filename = `${[
      'relatorio-filas',
      // csv.secretariasIds && `secretaria_${csv.secretariasIds}`,
      // csv.escolasIds && `escola_${csv.escolasIds}`,
      format(new Date(), 'yyyy-MM-dd-HH-mm-ss'),
    ]
      .filter(Boolean)
      .join('-')}.csv`;

    return new StreamableFile(csv.stream, {
      disposition: `attachment; filename="${filename}"`,
      type: 'text/csv',
    });
  }
}
