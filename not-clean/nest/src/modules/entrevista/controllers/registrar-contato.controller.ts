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
import { CreateRegistrarContatoDto } from '../dto/create-registrar-contato.dto';
import { UpdateRegistrarContatoDto } from '../dto/update-registrar-contatos.dto';
import { RegistrarContatoEntity } from '../entities/registrar-contato.entity';
import { RegistrarContatoService } from '../services/registrar-contato.service';

@ApiTags('Registro Contato')
@Controller('registro-contato')
export class RegistrarContatoController {
  constructor(private readonly service: RegistrarContatoService) { }

  @Get()
  @GetDoc(
    'Registro Contato',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<RegistrarContatoEntity>> {
    return this.service.findAll(acessoControl, query);
  }

  @Post('unidade-escolar/:idUnidadeEscolar/turno/:turno')
  @PostDoc(
    'Registro Contato',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
    ].join(', '),
    CreateRegistrarContatoDto,
  )
  create(
    @Body() data: CreateRegistrarContatoDto,
    @Param('idUnidadeEscolar') idUnidadeEscolar: string,
    @Param('turno') turno: string,
    @ResolveAcessoControl() acessoControl: AcessoControl,
  ) {
    return this.service.create(acessoControl, idUnidadeEscolar, turno, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Registro Contato',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
    ].join(', '),
    UpdateRegistrarContatoDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateRegistrarContatoDto,
  ) {
    return this.service.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc(
    'Registro Contato',
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
    return this.service.remove(acessoControl, id);
  }
}
