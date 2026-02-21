import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseBoolPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { GetDoc } from '../../../helpers/decorators/swagger.decorator';
import { Roles } from '../../../helpers/enums/role.enum';
import { CidadeEntity } from '../entities/cidade.entity';
import { CidadeService } from '../services/cidade.service';

@ApiTags('Base')
@Controller('base/cidades')
export class CidadeController {
  constructor(private readonly cidadeService: CidadeService) {}

  @Get(':uf')
  @GetDoc('Base', Roles.Publico, [
    {
      name: 'onlyWithConfiguredSecretarias',
      type: Boolean,
    },
  ])
  findByUf(
    @Param('uf') uf: string,
    @Query(
      'onlyWithConfiguredSecretarias',
      new DefaultValuePipe(false),
      ParseBoolPipe,
    )
    onlyWithConfiguredSecretarias = false,
  ) {
    return this.cidadeService.findByUf(uf, onlyWithConfiguredSecretarias);
  }

  @Get('')
  @GetDoc('Base', Roles.Publico, [
    'filter.estado.uf',
    {
      name: 'filter.secretariaMunicipalConfigurada',
      type: Boolean,
      required: false,
    },
  ])
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<CidadeEntity>> {
    return this.cidadeService.findAll(query);
  }
}
