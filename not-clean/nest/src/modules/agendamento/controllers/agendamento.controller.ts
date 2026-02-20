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
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../dto/update-agendamento.dto';
import { AgendamentoEntity } from '../entities/agendamento.entity';
import { AgendamentoService } from '../services/agendamento.service';

@ApiTags('Agendamento')
@Controller('/agendamento')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Get('/calendario/:idLocalAtendimento/:idGerenciaAgendamento')
  @GetDoc('Agendamento', Roles.Publico)
  calendarioAgendamento(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('idLocalAtendimento') idLocalAtendimento: string,
    @Param('idGerenciaAgendamento') idGerenciaAgendamento: string,
  ) {
    return this.agendamentoService.calendarioAgendamento(
      acessoControl,
      idGerenciaAgendamento,
      idLocalAtendimento,
    );
  }

  @Get('/calendario/:idLocalAtendimento/:idGerenciaAgendamento/:data')
  @GetDoc('Agendamento', Roles.Publico)
  calendarioAgendamentoPeriodo(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('idLocalAtendimento') idLocalAtendimento: string,
    @Param('idGerenciaAgendamento') idGerenciaAgendamento: string,
    @Param('data') data: Date,
  ) {
    return this.agendamentoService.calendarioAgendamentoPeriodo(
      acessoControl,
      idGerenciaAgendamento,
      idLocalAtendimento,
      data,
    );
  }

  // Rotas de compatibilidade - manter temporariamente para transição suave
  @Get('/calendario-legacy/:idSecretariaMunicipal/:idGerenciaAgendamento')
  @GetDoc('Agendamento (Legacy)', Roles.Publico)
  async calendarioAgendamentoLegacy(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('idSecretariaMunicipal') idSecretariaMunicipal: string,
    @Param('idGerenciaAgendamento') idGerenciaAgendamento: string,
  ) {
    // Busca o LocalAtendimento baseado na SecretariaMunicipal
    const localAtendimento = await this.agendamentoService.findLocalAtendimentoBySecretariaMunicipal(idSecretariaMunicipal);
    if (!localAtendimento) {
      throw new Error(`LocalAtendimento não encontrado para SecretariaMunicipal ${idSecretariaMunicipal}`);
    }
    
    return this.agendamentoService.calendarioAgendamento(
      acessoControl,
      idGerenciaAgendamento,
      localAtendimento.id,
    );
  }

  @Get('/calendario-legacy/:idSecretariaMunicipal/:idGerenciaAgendamento/:data')
  @GetDoc('Agendamento Período (Legacy)', Roles.Publico)
  async calendarioAgendamentoPeriodoLegacy(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('idSecretariaMunicipal') idSecretariaMunicipal: string,
    @Param('idGerenciaAgendamento') idGerenciaAgendamento: string,
    @Param('data') data: Date,
  ) {
    // Busca o LocalAtendimento baseado na SecretariaMunicipal
    const localAtendimento = await this.agendamentoService.findLocalAtendimentoBySecretariaMunicipal(idSecretariaMunicipal);
    if (!localAtendimento) {
      throw new Error(`LocalAtendimento não encontrado para SecretariaMunicipal ${idSecretariaMunicipal}`);
    }
    
    return this.agendamentoService.calendarioAgendamentoPeriodo(
      acessoControl,
      idGerenciaAgendamento,
      localAtendimento.id,
      data,
    );
  }

  @Get('/cpf/:cpfCrianca')
  @GetDoc('Agendamento', Roles.Publico)
  findByCpf(@Param('cpfCrianca') cpfCrianca: string) {
    return this.agendamentoService.findByCpf(cpfCrianca);
  }

  @Get(':id')
  @GetDoc('Agendamento', Roles.Publico)
  findOne(@Param('id') id: string) {
    return this.agendamentoService.findOne(null, id);
  }

  @Get()
  @GetDoc('Agendamento', Roles.Publico)
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<AgendamentoEntity>> {
    return this.agendamentoService.findAll(acessoControl, query);
  }

  @Post()
  @PostDoc('Agendamento', Roles.Publico, CreateAgendamentoDto)
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() createAgendamentoDto: CreateAgendamentoDto,
  ) {
    return this.agendamentoService.create(acessoControl, createAgendamentoDto);
  }

  @Patch(':id')
  @PatchDoc('Agendamento', Roles.Publico, UpdateAgendamentoDto)
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() updateAgendamentoDto: UpdateAgendamentoDto,
  ) {
    return this.agendamentoService.update(acessoControl, id, updateAgendamentoDto);
  }

  @Delete(':id')
  @DeleteDoc('Agendamento', Roles.Publico)
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.agendamentoService.remove(acessoControl, id);
  }

  @Post('/deleteDuplicados')
  @DeleteDoc('Agendamento', Roles.Publico)
  deleteDuplicados() {
    return this.agendamentoService.removeDuplicates(null);
  }
}
