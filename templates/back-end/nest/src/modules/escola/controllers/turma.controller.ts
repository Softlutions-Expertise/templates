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
import { CreateTurmaDto } from '../dto/create-turma.dto';
import { UpdateTurmaDto } from '../dto/update-turma.dto';
import { TurmaEntity } from '../entities/turma.entity';
import { TurmaService } from '../services/turma.service';

@ApiTags('Turma')
@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Get(':id')
  @GetDoc(
    'Turma',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  findOne(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.turmaService.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc(
    'Turma',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    [
      'search',
      'filter.anoLetivo',
      'filter.situacao',
      'filter.escola.id',
      'filter.escola.secretariaMunicipal.id',
      'filter.turno',
      'filter.createdAt',
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<TurmaEntity>> {
    return this.turmaService.findAll(acessoControl, query);
  }

  @Get('anos-letivos/secretaria-municipal/:secretariaMunicipalId')
  @GetDoc(
    'Turma',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  findAnosLetivosTurmasBySecretariaMunicipal(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('secretariaMunicipalId') secretariaMunicipalId: string,
  ) {
    return this.turmaService.findAnosLetivosTurmasBySecretariaMunicipal(
      acessoControl,
      secretariaMunicipalId,
    );
  }

  @Post()
  @PostDoc(
    'Turma',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.GestorDeCreche,
    ].join(', '),
    CreateTurmaDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateTurmaDto,
  ) {
    return this.turmaService.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Turma',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.GestorDeCreche,
    ].join(', '),
    UpdateTurmaDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateTurmaDto,
  ) {
    return this.turmaService.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc(
    'Turma',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.turmaService.remove(acessoControl, id);
  }
}
