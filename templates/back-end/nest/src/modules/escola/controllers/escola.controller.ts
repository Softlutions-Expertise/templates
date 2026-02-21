import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import {
  DeleteDoc,
  GetDoc,
  PatchDoc,
  PostDoc,
} from '../../../helpers/decorators/swagger.decorator';
import { Roles } from '../../../helpers/enums/role.enum';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators';
import { CreateEscolaDto } from '../dto/create-escola.dto';
import { UpdateEscolaDto } from '../dto/update-escola.dto';
import { EscolaOpcaoRepository } from '../repositories/escola-opcao.repository';
import { EscolaService, IMappedEscola } from '../services/escola.service';

@ApiTags('Escola')
@Controller('escola')
export class EscolaController {
  constructor(
    private readonly escolaService: EscolaService,
    private readonly opcaoRepository: EscolaOpcaoRepository,
  ) {}

  @Get('quantidade-vagas')
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
    ['filter.vagaAtiva', 'filter.secretariaMunicipal.id'],
  )
  findAllWithQuantVagas(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Query('filter.secretariaMunicipal.id') filterSecretariaMunicipalId,
    @Query('filter.vagaAtiva') vagaAtiva,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    return this.escolaService.findAllWithQuantVagas(
      acessoControl,
      filterSecretariaMunicipalId,
      vagaAtiva,
      limit,
      page,
    );
  }

  @Get(':id')
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
  )
  findOne(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.escolaService.findOne(acessoControl, id);
  }

  @Get('cidade/:idCidade')
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
  )
  findAllByCidade(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('idCidade') idCidade: number,
  ) {
    return this.escolaService.findAllByCidade(acessoControl, idCidade);
  }

  @Get()
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
    [
      'search',
      'filter.id',
      'filter.endereco.cidade.id',
      'filter.secretariaMunicipal.id',
      'filter.turmas.etapa.id',
      {
        name: 'filter.verTurnos',
        type: Boolean,
        required: false,
      },
      {
        name: 'filter.verEtapas',
        type: Boolean,
        required: false,
      },
      {
        name: 'filter.vinculadoFila',
        type: Boolean,
        required: false,
      },
      {
        name: 'filter.turmas.anoLetivo',
        type: String,
        required: false,
      },
      {
        name: 'filter.turmas.situacao',
        type: Boolean,
        required: false,
      },
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<IMappedEscola>> {
    return this.escolaService.findAll(acessoControl, query);
  }

  @Post()
  @PostDoc(
    'Escola',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
    CreateEscolaDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateEscolaDto,
  ) {
    return this.escolaService.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Escola',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
    UpdateEscolaDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateEscolaDto,
  ) {
    return this.escolaService.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc(
    'Escola',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
  )
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.escolaService.remove(acessoControl, id);
  }
}
