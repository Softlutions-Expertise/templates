import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { GetDoc } from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { NeedsAuth } from '../../infrastructure';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { FilaAnalyticsService } from './fila-analytics.service';
import { FilaService } from './fila.service';

@ApiTags('Fila')
@Controller('/fila')
export class FilaController {
  constructor(
    private readonly filaService: FilaService,
    private readonly filaAnalyticsService: FilaAnalyticsService,
  ) {}

  // @NeedsAuth()
  @Get(':idSecretaria/:idEscola/:idEtapa/:turno/:anoLetivo')
  @GetDoc(
    'Fila',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.GestorDeCreche,
      Roles.Defensoria,
    ].join(','),
  )
  gerarFila1(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('idEscola') idEscola?: string,
    @Param('idEtapa') idEtapa?: number,
    @Param('turno') turno?: string,
    @Param('anoLetivo') anoLetivo?: string,
    @Paginate() query?: PaginateQuery,
  ) {
    if (!idEscola) {
      throw new BadRequestException('Informe o idEscola');
    }

    if (!idEtapa) {
      throw new BadRequestException('Informe o idEtapa');
    }

    if (!turno) {
      throw new BadRequestException('Informe o turno');
    }
    if (!anoLetivo) {
      throw new BadRequestException('Informe o anoLetivo');
    }

    return this.filaService.getFilaPosicao(
      acessoControl,
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
      query,
    );
  }

  @Get('anonimizada/vagasconcedidas')
  @GetDoc('Entrevista', [Roles.Publico].join(', '), [
    'search',
    'filter.reservaVaga.vaga.anoLetivo',
    'filter.reservaVaga.vaga.turma.turno',
    'filter.reservaVaga.vaga.turma.etapa.id',
    'filter.reservaVaga.vaga.escola.id',
  ])
  getEntrevistasComVagas(@Paginate() query?: PaginateQuery) {
    return this.filaService.getEntrevistasComVagas(query);
  }

  @Get('cidade/:cidade/cpf/:cpf/data-nascimento/:dataNascimento')
  @GetDoc('Fila', [Roles.Publico].join(', '), ['nomeResponsavel'])
  async getFilaByCpf(
    @Param('cidade') cidade: number,
    @Param('cpf') cpf: string,
    @Param('dataNascimento') dataNascimento: string,
    @Query() query: any,
  ) {
    return await this.filaService.getFilaPosicaoByCPF(
      cidade,
      cpf,
      dataNascimento,
      query,
    );
  }

  @Get('csv/:idSecretaria/:idEscola/:idEtapa/:turno/:anoLetivo')
  async gerarFilaAnonimizadaCsv(
    @Param('idEscola') idEscola: string,
    @Param('idEtapa') idEtapa: number,
    @Param('turno') turno: string,
    @Param('anoLetivo') anoLetivo: string,
    @Query() query: PaginateQuery,
    @Res() res: Response,
  ) {
    if (!idEscola) {
      throw new BadRequestException('Informe o idEscola');
    }

    if (!idEtapa) {
      throw new BadRequestException('Informe o idEtapa');
    }

    if (!turno) {
      throw new BadRequestException('Informe o turno');
    }

    if (!anoLetivo) {
      throw new BadRequestException('Informe o anoLetivo');
    }

    const csv = await this.filaService.getFilaPosicaoAnonimizadacsv(
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
      query,
    );

    res.header('Content-Type', 'text/csv');
    res.attachment('fila_posicao.csv');
    res.send(csv);
  }

  @Get('vagas/csv')
  async getEntrevistasComVagasCSV(
    @Paginate() query: PaginateQuery,
    @Res() res: Response,
  ) {
    const csv = await this.filaService.getEntrevistasComVagasCSV(query);
    res.header('Content-Type', 'text/csv');
    res.attachment('fila_posicao.csv');
    res.send(csv);
  }

  @Get('anonimizada/:idSecretaria/:idEscola/:idEtapa/:turno/:anoLetivo')
  gerarFilaAnonimizada(
    @Param('idEscola') idEscola?: string,
    @Param('idEtapa') idEtapa?: number,
    @Param('turno') turno?: string,
    @Param('anoLetivo') anoLetivo?: string,
    @Paginate() query?: PaginateQuery,
  ) {
    if (!idEscola) {
      throw new BadRequestException('Informe o idEscola');
    }

    if (!idEtapa) {
      throw new BadRequestException('Informe o idEtapa');
    }

    if (!turno) {
      throw new BadRequestException('Informe o turno');
    }
    if (!anoLetivo) {
      throw new BadRequestException('Informe o anoLetivo');
    }

    return this.filaService.getFilaPosicaoAnonimizada(
      idEscola,
      idEtapa,
      turno,
      anoLetivo,
      query,
    );
  }

  @Get('ultima/:idSecretaria/:idEscola/:idEtapa/:turno/:anoLetivo')
  getLastFila(
    @Param('idEscola') idEscola?: string,
    @Param('idEtapa') idEtapa?: number,
    @Param('turno') turno?: string,
    @Param('anoLetivo') anoLetivo?: string,

    @Paginate() query?: PaginateQuery,
  ) {
    if (!idEscola) {
      throw new BadRequestException('Informe o idEscola');
    }

    if (!idEtapa) {
      throw new BadRequestException('Informe o idEtapa');
    }

    if (!turno) {
      throw new BadRequestException('Informe o turno');
    }

    if (!anoLetivo) {
      throw new BadRequestException('Informe o anoLetivo');
    }

    return this.filaService.getLastFila(idEscola, idEtapa, turno, anoLetivo);
  }

  @Get('analytics/:anoLetivo/:secretariaMunicipalId')
  @GetDoc(
    'Fila',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.GestorDeCreche,
      Roles.Defensoria,
    ].join(','),
  )
  async getQuantPerFila(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('anoLetivo') anoLetivo: string,
    @Param('secretariaMunicipalId') secretariaMunicipalId: string,
    @Query('filter.escolaId.id') escolaId?: string,
    @Query('filter.etapa.id') etapaId?: number,
    @Query('filter.turno') turno?: string,
  ) {
    return this.filaAnalyticsService.getQuantPerFila(
      acessoControl,
      anoLetivo,
      secretariaMunicipalId,
      escolaId,
      etapaId,
      turno,
    );
  }

  @Get('/criancas/analytics/:anoLetivo/:secretariaMunicipalId')
  @GetDoc(
    'Fila',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.GestorDeCreche,
      Roles.Defensoria,
    ].join(','),
  )
  async getFilaWithInfoCrianca(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('anoLetivo') anoLetivo: string,
    @Param('secretariaMunicipalId') secretariaMunicipalId: string,
    @Query('filter.escolaId.id') escolaId?: string,
    @Query('filter.etapa.id') etapaId?: number,
    @Query('filter.turno') turno?: string,
  ) {
    return this.filaAnalyticsService.getFilaWithInfoCrianca(
      acessoControl,
      anoLetivo,
      secretariaMunicipalId,
      escolaId,
      etapaId,
      turno,
    );
  }

  @Post('regerar')
  @NeedsAuth()
  @ApiQuery({
    name: 'escola.id',
    schema: {
      type: 'string',
      format: 'uuid',
    },
    required: false,
  })
  @ApiQuery({
    name: 'escola.secretariaMunicipal.id',
    schema: {
      type: 'string',
      format: 'uuid',
    },
    required: false,
  })
  @ApiQuery({
    name: 'anoLetivo',
    schema: {
      type: 'string',
    },
    required: false,
  })
  async regerarFilas(
    @ResolveAcessoControl()
    acessoControl: AcessoControl,

    @Query('escola.id', new ParseUUIDPipe({ optional: true }))
    escolaId?: string | undefined,

    @Query('anoLetivo')
    anoLetivo?: string | undefined,

    @Query(
      'escola.secretariaMunicipal.id',
      new ParseUUIDPipe({ optional: true }),
    )
    escolaSecretariaMunicipalId?: string | undefined,
  ) {
    return this.filaService.regerarFilas(
      acessoControl,
      escolaSecretariaMunicipalId,
      escolaId,
      anoLetivo,
    );
  }
}
