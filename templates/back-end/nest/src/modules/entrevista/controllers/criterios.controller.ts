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
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators';
import { CreateCriteriosDto } from '../dto/create-criterios';
import { UpdateCriteriosDto } from '../dto/update-criterios';
import { CriteriosEntity } from '../entities/criterios.entity';
import { CriteriosService } from '../services/criterios.service';

@ApiTags('Critérios')
@Controller('/criterios')
export class CriteriosController {
  constructor(private readonly service: CriteriosService) {}

  @Get(':id')
  @GetDoc('Critérios', 'admin')
  findOne(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.service.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc('Critérios', 'admin', ['search', 'filter.secretariaMunicipal.id'])
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<CriteriosEntity>> {
    return this.service.findAll(acessoControl, query);
  }

  @Post()
  @PostDoc('Critérios', 'admin', CreateCriteriosDto)
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateCriteriosDto,
  ) {
    return this.service.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc('Critérios', 'admin', UpdateCriteriosDto)
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateCriteriosDto,
  ) {
    return this.service.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc('Critérios', 'admin')
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.service.remove(acessoControl, id);
  }
}
