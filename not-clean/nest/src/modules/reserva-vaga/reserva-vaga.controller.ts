import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import {
  DeleteDoc,
  GetDoc,
  PostDoc,
} from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { CreateReservaVagaDto } from './dto/create-reserva-vaga.dto';
import { UpdateReservaVagaDadosMatriculaDto } from './dto/update-reserva-vaga-dados-matricula.dto';
import { UpdateReservaVagaStatusDto } from './dto/update-reserva-vaga-status.dto';
import { ReservaVagaEntity } from './entities/reserva-vaga.entity';
import { ReservaVagaService } from './reserva-vaga.service';

@ApiTags('Reserva Vaga')
@Controller('reserva-vaga')
export class ReservaVagaController {
  constructor(private readonly service: ReservaVagaService) { }

  @Get(':id')
  @GetDoc(
    'Reserva Vaga',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  async findOne(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ReservaVagaEntity> {
    return this.service.findOne(acessoControl, id);
  }

  // Rota para verificar se existe uma reserva de vaga para a entrevista e bloquear o edite no front caso haja
  @Get('entrevista/:entrevistaId')
  @GetDoc(
    'Reserva Vaga',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  async findOneByEntrevistaId(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('entrevistaId', new ParseUUIDPipe()) entrevistaId: string,
  ): Promise<ReservaVagaEntity> {
    return this.service.findOneByEntrevistaId(acessoControl, entrevistaId);
  }

  @Get()
  @GetDoc(
    'Reserva Vaga',
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
      'filter.vaga.anoLetivo',
      'filter.vaga.escola.id',
      'filter.vaga.escola.secretariaMunicipal.id',
      'filter.vaga.turma.etapa.id',
      'filter.vaga.turma.turno',
      'filter.vaga.turma.id',
      'filter.startDateOccupation',
      'filter.endDateOccupation',
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<ReservaVagaEntity>> {
    return this.service.findAll(acessoControl, query);
  }

  @Post()
  @PostDoc(
    'Reserva Vaga',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.GestorDeCreche,
    ].join(', '),
    CreateReservaVagaDto,
  )
  async create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() dto: CreateReservaVagaDto,
  ): Promise<ReservaVagaEntity> {
    return this.service.create(acessoControl, dto);
  }

  @Delete(':id')
  @DeleteDoc(
    'Reserva Vaga',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  async delete(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ): Promise<ReservaVagaEntity> {
    return this.service.delete(acessoControl, id);
  }

  @Post('/status/:id')
  @PostDoc(
    'Reserva Vaga',
    [
      Roles.Administrador,
      Roles.GestorDeCreche,
      Roles.AdministradorMunicipal,
    ].join(', '),
    UpdateReservaVagaStatusDto,
  )
  async updateStatus(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() dto: UpdateReservaVagaStatusDto,
  ): Promise<ReservaVagaEntity> {
    return this.service.updateStatusReservaVaga(acessoControl, id, dto);
  }

  @Post('/dados-matricula/:id')
  @PostDoc(
    'Reserva Vaga',
    [
      Roles.Administrador,
      Roles.GestorDeCreche,
      Roles.AdministradorMunicipal,
    ].join(', '),
    UpdateReservaVagaDadosMatriculaDto,
  )
  async updateDadosMatriculaReservaVaga(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() dto: UpdateReservaVagaDadosMatriculaDto,
  ): Promise<ReservaVagaEntity> {
    return this.service.updateDadosMatriculaReservaVaga(acessoControl, id, dto);
  }
}
