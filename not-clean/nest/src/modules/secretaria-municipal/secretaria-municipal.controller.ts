import {
  Body,
  Controller,
  DefaultValuePipe,
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
} from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { CreateSecretariaMunicipalDto } from './dto/create-secretaria-municipal.dto';
import {
  SecretariaMunicipalFindAllFilterAction,
  SecretariaMunicipalFindAllFilterConfiguracao,
} from './dto/secretaria-municipal.dto';
import { UpdateSecretariaMunicipalDto } from './dto/update-secretaria-municipal.dto';
import { SecretariaMunicipalEntity } from './entities/secretaria-municipal.entity';
import { SecretariaMunicipalService } from './secretaria-municipal.service';

@ApiTags('Secretaria Municipal')
@Controller('secretaria-municipal')
export class SecretariaMunicipalController {
  constructor(
    private readonly secretrariaMunicipalService: SecretariaMunicipalService,
  ) {}

  @Get(':id')
  @GetDoc(
    'Secretaria Municipal',
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
    return this.secretrariaMunicipalService.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc(
    'Secretaria Municipal',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
      Roles.Publico,
    ].join(', '),
    [
      {
        name: 'filtroConfiguracao',
        enum: SecretariaMunicipalFindAllFilterConfiguracao,
        required: false,
      },
      {
        name: 'filtroAction',
        enum: SecretariaMunicipalFindAllFilterAction,
        required: false,
      },
      'search',
      'filter.id',
      'filter.endereco.cidade.id',
      'filter.secretariaMunicipalEtapas.apelido',
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
    @Query(
      'filtroConfiguracao',
      new DefaultValuePipe(SecretariaMunicipalFindAllFilterConfiguracao.ALL),
    )
    filterConfiguracao: SecretariaMunicipalFindAllFilterConfiguracao = SecretariaMunicipalFindAllFilterConfiguracao.ALL,

    @Query(
      'filtroAction',
      new DefaultValuePipe(
        SecretariaMunicipalFindAllFilterAction['secretaria:read'],
      ),
    )
    filterAction: SecretariaMunicipalFindAllFilterAction = SecretariaMunicipalFindAllFilterAction[
      'secretaria:read'
    ],
  ): Promise<Paginated<SecretariaMunicipalEntity>> {
    return this.secretrariaMunicipalService.findAll(
      acessoControl,
      query,
      filterConfiguracao,
      filterAction,
    );
  }

  @Post()
  @PostDoc(
    'Secretaria Municipal',
    Roles.Administrador,
    CreateSecretariaMunicipalDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateSecretariaMunicipalDto,
  ) {
    return this.secretrariaMunicipalService.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Secretaria Municipal',
    Roles.Administrador,
    UpdateSecretariaMunicipalDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateSecretariaMunicipalDto,
  ) {
    return this.secretrariaMunicipalService.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc('Secretaria Municipal', Roles.Administrador)
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.secretrariaMunicipalService.remove(acessoControl, id);
  }
}
