import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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
import { DeactivateManyDiasNaoUteisDto } from '../dto/deactivate-many-dias-nao-uteis.dto';
import { CreateDiasNaoUteisDto } from '../dto/dias-nao-uteis.dto';
import { UpdateDiasNaoUteisDto } from '../dto/update-dias-nao-uteis.dto';
import { DiasNaoUteisEntity } from '../entities/dias-nao-uteis.entity';
import { DiasNaoUteisService } from '../services/dias-nao-uteis.service';

@ApiTags('Dias Nao Uteis')
@Controller('/dias-nao-uteis')
export class DiasNaoUteisController {
  constructor(private readonly diasNaoUteisService: DiasNaoUteisService) { }

  @Get(':id')
  @GetDoc(
    'Dias Nao Uteis',
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
    @Param('id') id: number,
  ) {
    return this.diasNaoUteisService.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc(
    'Dias Nao Uteis',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
    [
      'page',
      'search',
      'limit',

      'filter.id',
      'filter.ativo',
      'filter.gerenciaAgendamento.id',
      'filter.dataFeriado',

      'atingeAno',
      'atingeGerenciaAgendamentoId',
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
    @Query('atingeAno', new ParseIntPipe({ optional: true }))
    atingeAno: number | null,
    @Query('atingeGerenciaAgendamentoId', new ParseUUIDPipe({ optional: true }))
    atingeGerenciaAgendamentoId: string | null,
  ): Promise<Paginated<DiasNaoUteisEntity>> {
    return this.diasNaoUteisService.findAll(acessoControl, query, {
      atingeAno,
      atingeGerenciaAgendamentoId,
    });
  }

  @Post()
  @PostDoc(
    'Dias Nao Uteis',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
    CreateDiasNaoUteisDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateDiasNaoUteisDto,
  ) {
    return this.diasNaoUteisService.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Dias Nao Uteis',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
    UpdateDiasNaoUteisDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: number,
    @Body() data: UpdateDiasNaoUteisDto,
  ) {
    return this.diasNaoUteisService.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc(
    'Dias Nao Uteis',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
  )
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: number,
  ) {
    return this.diasNaoUteisService.remove(acessoControl, id);
  }

  @Post('/deactivate-many')
  @DeleteDoc(
    'Dias Nao Uteis',
    [Roles.Administrador, Roles.AdministradorMunicipal].join(', '),
  )
  deactivateManyDiasNaoUteis(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() dto: DeactivateManyDiasNaoUteisDto,
  ) {
    return this.diasNaoUteisService.deactivateManyDiasNaoUteis(
      acessoControl,
      dto,
    );
  }
}
