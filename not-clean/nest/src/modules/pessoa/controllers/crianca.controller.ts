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
import { LimparCpf } from '../../../helpers/functions/Mask';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators';
import { CreateCriancaDto } from '../dto/create-crianca.dto';
import { UpdateCriancaDto } from '../dto/update-crianca.dto';
import { CriancaEntity } from '../entities/crianca.entity';
import { CriancaService } from '../services/crianca.service';

@ApiTags('Criança')
@Controller('pessoa/crianca')
export class CriancaController {
  constructor(private readonly criancaService: CriancaService) {}

  @Get('/cpf/:cpf')
  @GetDoc(
    'Criança',
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
  ): Promise<CriancaEntity> {
    return this.criancaService.findOneByCpf(acessoControl, LimparCpf(cpf));
  }

  @Get(':id')
  @GetDoc(
    'Criança',
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
    return this.criancaService.findOne(acessoControl, id);
  }

  @Get('cidade/:idCidade')
  @GetDoc(
    'Criança',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  findAllByCidade(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('idCidade') idCidade: string,
  ) {
    return this.criancaService.findAllByCidade(acessoControl, idCidade);
  }

  @Get()
  @GetDoc(
    'Criança',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    ['search', 'filter.endereco.cidade.id'],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<CriancaEntity>> {
    return this.criancaService.findAll(acessoControl, query);
  }

  @Post()
  @PostDoc(
    'Criança',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
    ].join(', '),
    CreateCriancaDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateCriancaDto,
  ) {
    return this.criancaService.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Criança',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
    ].join(', '),
    UpdateCriancaDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateCriancaDto,
  ) {
    return this.criancaService.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc(
    'Criança',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
    ].join(', '),
  )
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.criancaService.remove(acessoControl, id);
  }
}
