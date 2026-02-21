import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import {
  DeleteDoc,
  GetDoc,
  PatchDoc,
  PostDoc,
} from '../../../helpers/decorators/swagger.decorator';
import { Roles } from '../../../helpers/enums/role.enum';
import { NeedsAuth } from '../../../infrastructure';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators';
import { CreateGerenciaAgendamentoDto } from '../dto/create-gerencia-agendamento.dto';
import { UpdateGerenciaAgendamentoDto } from '../dto/update-gerencia-agendamento.dto';
import { GerenciaAgendamentoEntity } from '../entities/gerencia-agendamento.entity';
import { GerenciaAgendamentoService } from '../services/gerencia-agendamentos.service';

@ApiTags('Gerencia Agendamento')
@Controller('/gerenciar-agendamento')
export class GerenciaAgendamentoController {
  constructor(
    private readonly gerenciaAgendamentoService: GerenciaAgendamentoService,
  ) {}

  @Get(':id')
  @GetDoc(
    'Gerencia Agendamento',
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
    return this.gerenciaAgendamentoService.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc(
    'Gerencia Agendamento',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
    [
      'filter.localAtendimento.secretariaMunicipal.id',
      'filter.localAtendimento.id',
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<GerenciaAgendamentoEntity>> {
    return this.gerenciaAgendamentoService.findAll(acessoControl, query);
  }

  @Post()
  @PostDoc(
    'Gerencia Agendamento',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
    CreateGerenciaAgendamentoDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateGerenciaAgendamentoDto,
  ) {
    return this.gerenciaAgendamentoService.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Gerencia Agendamento',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
    UpdateGerenciaAgendamentoDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateGerenciaAgendamentoDto,
  ) {
    return this.gerenciaAgendamentoService.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc(
    'Gerencia Agendamento',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
  )
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.gerenciaAgendamentoService.remove(acessoControl, id);
  }

  @Post('reagendar')
  @NeedsAuth()
  @ApiQuery({
    name: 'secretariaMunicipal.id',
    schema: {
      type: 'string',
      format: 'uuid',
    },
    required: false,
  })
  async reagendar(
    @ResolveAcessoControl()
    acessoControl: AcessoControl,

    @Query('secretariaMunicipal.id', new ParseUUIDPipe({ optional: true }))
    secretariaMunicipalId?: string | undefined,
  ) {
    return this.gerenciaAgendamentoService.rescheduleAgendamentos(
      acessoControl,
      secretariaMunicipalId,
    );
  }
}
