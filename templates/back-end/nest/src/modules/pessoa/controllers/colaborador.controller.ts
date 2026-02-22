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
import { LimparCpf } from '../../../helpers/functions/Mask';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators';
import { CreateColaboradorDto } from '../dto/create-colaborador.dto';
import { UpdateColaboradorDto } from '../dto/update-colaborador.dto';
import { ColaboradorEntity } from '../entities/colaborador.entity';
import { ColaboradorService } from '../services/colaborador.service';

@ApiTags('Colaborador')
@Controller('/pessoa/colaborador')
export class ColaboradorController {
  constructor(private readonly service: ColaboradorService) {}

  @Get('/cpf/:cpf')
  @GetDoc(
    'Colaborador',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  findOneByCpf(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('cpf') cpf: string,
  ): Promise<ColaboradorEntity> {
    return this.service.findOneByCpf(acessoControl, LimparCpf(cpf));
  }

  @Get(':id')
  @GetDoc(
    'Colaborador',
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
  ): Promise<ColaboradorEntity> {
    return this.service.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc(
    'Colaborador',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['search', 'filter.instituicaoId'],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
    @Query('filter.instituicaoId') instituicaoId?: string,
  ): Promise<Paginated<ColaboradorEntity>> {
    return this.service.findAll(acessoControl, query, instituicaoId);
  }

  @Get('/mapa/coordenadas')
  @GetDoc(
    'Colaborador - Mapa',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['filter.cidadeId'],
  )
  findAllWithCoordinates(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Query('filter.cidadeId') cidadeId?: string,
  ): Promise<ColaboradorEntity[]> {
    return this.service.findAllWithCoordinates(acessoControl, cidadeId);
  }

  @Post()
  @PostDoc(
    'Colaborador',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.GestorDeCreche,
    ].join(', '),
    CreateColaboradorDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateColaboradorDto,
  ) {
    return this.service.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Colaborador',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.GestorDeCreche,
    ].join(', '),
    UpdateColaboradorDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateColaboradorDto,
  ) {
    return this.service.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc(
    'Colaborador',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.service.remove(acessoControl, id);
  }
}
