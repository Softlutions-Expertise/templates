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
import { CreateFuncionarioDto } from '../dto/create-funcionario.dto';
import { FuncionarioDto } from '../dto/funcionario.dto';
import { UpdateFuncionarioDto } from '../dto/update-funcionario.dto';
import { FuncionarioEntity } from '../entities/funcionario.entity';
import {
  FuncionarioComEscola,
  FuncionarioService,
} from '../services/funcionario.service';

@ApiTags('Funcionário')
@Controller('/pessoa/funcionario')
export class FuncionarioController {
  constructor(private readonly service: FuncionarioService) {}

  @Get('/cpf/:cpf')
  @GetDoc(
    'Funcionário',
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
  ): Promise<FuncionarioDto> {
    return this.service.findOneByCpf(acessoControl, LimparCpf(cpf));
  }

  @Get(':id')
  @GetDoc(
    'Funcionário',
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
  ): Promise<FuncionarioComEscola> {
    return this.service.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc(
    'Funcionário',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['search', 'filter.secretariaMunicipal.id', 'filter.unidadeEscolar.id'],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
    @Query('filter.secretariaMunicipal.id') secretariaMunicipalId,
    @Query('filter.unidadeEscolar.id') unidadeEscolarId,
  ): Promise<Paginated<FuncionarioEntity>> {
    return this.service.findAll(
      acessoControl,
      query,
      secretariaMunicipalId,
      unidadeEscolarId,
    );
  }

  @Post()
  @PostDoc(
    'Funcionário',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.GestorDeCreche,
    ].join(', '),
    CreateFuncionarioDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateFuncionarioDto,
  ) {
    return this.service.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Funcionário',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.GestorDeCreche,
    ].join(', '),
    UpdateFuncionarioDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateFuncionarioDto,
  ) {
    return this.service.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc(
    'Funcionário',
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
