import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { CreateVagasDto } from '../dto/create-vagas.dto';
import { UpdateVagasDto } from '../dto/update-vagas.dto';
import { VagaEntity } from '../entities/vaga.entity';
import { VagasService } from '../services/vagas.service';

@ApiTags('Vagas')
@Controller('vagas')
export class VagasController {
  constructor(private readonly service: VagasService) {}

  @Get(':id')
  @GetDoc(
    'Vagas',
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
    @Param('id') id: string,
  ): Promise<VagaEntity> {
    return this.service.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc(
    'Vagas',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    [
      'search',
      'filter.ativa',
      'filter.anoLetivo',
      'filter.escola.id',
      'filter.escola.secretariaMunicipal.id',
      'filter.turma.id',
      {
        name: 'filter.turma.situacao',
        type: Boolean,
        required: false,
      },
      'filter.turma.turno',
      'filter.turma.etapa.id',
      'filter.turma.etapa.nome',
      'filter.createdAt'
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<VagaEntity>> {
    return this.service.findAll(acessoControl, query);
  }

  @Post()
  @PostDoc(
    'Vagas',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.GestorDeCreche,
    ].join(', '),
    CreateVagasDto,
  )
  async create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() dto: CreateVagasDto,
  ): Promise<VagaEntity> {
    return this.service.create(acessoControl, dto);
  }

  @Patch(':id')
  @PatchDoc(
    'Vagas',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.GestorDeCreche,
    ].join(', '),
    UpdateVagasDto,
  )
  async update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() dto: UpdateVagasDto,
  ): Promise<VagaEntity> {
    return this.service.update(acessoControl, id, dto);
  }

  @Delete(':id')
  @DeleteDoc(
    'Vagas',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  async delete(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ): Promise<VagaEntity> {
    return this.service.delete(acessoControl, id);
  }
}
