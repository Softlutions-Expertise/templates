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
import { CreateIntegrationAccessTokenDto } from './dto/create-integration-access-token.dto';
import { UpdateIntegrationAccessTokenDto } from './dto/update-integration-access-token.dto';
import { IntegrationAccessTokenEntity } from './entities/integration-access-token.entity';
import { IntegrationAccessTokenService } from './integration-access-token.service';

@ApiTags('Tokens de Integração')
@Controller('/integrations/integration-access-tokens')
export class IntegrationAccessTokenController {
  constructor(readonly service: IntegrationAccessTokenService) {}

  @Get(':id')
  @GetDoc(
    'Tokens de Integração',
    [Roles.Administrador, Roles.Defensoria].join(', '),
  )
  findOne(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.service.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc(
    'Tokens de Integração',
    [Roles.Administrador, Roles.Defensoria].join(', '),
    [
      'search',
      'filter.id',
      'filter.funcionarioAutor.id',
      'filter.herdaPermissoesDeFuncionario.id',
      'filter.validoAte',
      'filter.createdAt',
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<IntegrationAccessTokenEntity>> {
    return this.service.findAll(acessoControl, query);
  }

  @Post()
  @PostDoc(
    'Tokens de Integração',
    Roles.Administrador,
    CreateIntegrationAccessTokenDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateIntegrationAccessTokenDto,
  ) {
    return this.service.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Tokens de Integração',
    Roles.Administrador,
    UpdateIntegrationAccessTokenDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateIntegrationAccessTokenDto,
  ) {
    return this.service.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc('Tokens de Integração', Roles.Administrador)
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.service.remove(acessoControl, id);
  }
}
