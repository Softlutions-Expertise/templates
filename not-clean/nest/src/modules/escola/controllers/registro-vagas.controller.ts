import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { GetDoc, PostDoc } from '../../../helpers/decorators/swagger.decorator';
import { NeedsAuth } from '../../../infrastructure';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators';
import { CreateRegistroVagasDto } from '../dto/create-registro-vagas.dto';
import { RegistroVagasEntity } from '../entities/registro-vagas.entity';
import { RegistroVagasService } from '../services/registro-vagas.service';

@ApiTags('Registro Vagas')
@Controller('registro-vagas')
export class RegistroVagasController {
  constructor(private readonly service: RegistroVagasService) {}

  @Get(':id')
  @GetDoc('Registro Vagas', 'admin')
  async findOne(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ): Promise<CreateRegistroVagasDto> {
    return this.service.findOne(acessoControl, id);
  }

  @Get()
  @GetDoc('Registro Vagas', 'admin', ['search'])
  async findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<RegistroVagasEntity>> {
    return this.service.findAll(acessoControl, query);
  }

  @Post()
  @NeedsAuth()
  @PostDoc('Registro Vagas', 'admin', CreateRegistroVagasDto)
  async create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() dto: CreateRegistroVagasDto,
  ): Promise<RegistroVagasEntity> {
    return this.service.create(acessoControl, dto);
  }
}
