import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Readable } from 'stream';
import { GetDoc } from '../../../helpers/decorators/swagger.decorator';
import { Roles } from '../../../helpers/enums/role.enum';
import { generateJsonArray } from '../../../helpers/generate-json-array-iterable';
import { HorariosAgendamentoService } from '../services/horarios-agendamento.service';

@ApiTags('Agendamento')
@Controller('/agendamento')
export class HorariosAgendamentoController {
  constructor(
    private readonly horariosAgendamentosService: HorariosAgendamentoService,
  ) { }

  @Get('/horarios/:idGerenciaAgendamento')
  @GetDoc('Agendamento', Roles.Publico)
  horariosDisponiveisAll(
    @Param('idGerenciaAgendamento') idGerenciaAgendamento: string,
  ) {
    return this.horariosAgendamentosService.getAllHorariosByIdGerencia(
      idGerenciaAgendamento,
    );
  }

  @Get('/horarios/:idGerenciaAgendamento/:data')
  @GetDoc('Agendamento', Roles.Publico)
  horariosDisponiveis(
    @Param('idGerenciaAgendamento') idGerenciaAgendamento: string,
    @Param('data') data: Date,
  ) {
    return this.horariosAgendamentosService.horariosDisponiveisByIdGerenciaAndDia(
      idGerenciaAgendamento,
      data,
    );
  }

  @Get('/dias/:idGerenciaAgendamento/ano-mes/:ano/:mes')
  @GetDoc('Agendamento', Roles.Publico)
  async getCalendarioMes(
    @Param('idGerenciaAgendamento') idGerenciaAgendamento: string,
    @Param('ano', ParseIntPipe) ano: number,
    @Param('mes', ParseIntPipe) mes: number,
  ) {
    const dias =
      await this.horariosAgendamentosService.checarDiasDisponiveisAnoMes(
        idGerenciaAgendamento,
        ano,
        mes,
      );

    return new StreamableFile(Readable.from(generateJsonArray(dias)), {
      type: 'text/json',
      disposition: 'inline',
    });
  }

  @Get('/dias-disponiveis/:idGerenciaAgendamento')
  @GetDoc('Agendamento', Roles.Publico)
  async proximosDiasDisponiveis(
    @Param('idGerenciaAgendamento') idGerenciaAgendamento: string,
    @Query('inicio') inicio: Date,
  ) {
    const diasDisponiveis =
      this.horariosAgendamentosService.getProximosDiasDisponiveisByIdGerencia(
        idGerenciaAgendamento,
        inicio,
        1000,
        10,
      );

    return new StreamableFile(
      Readable.from(generateJsonArray(diasDisponiveis)),
      { type: 'text/json', disposition: 'inline' },
    );
  }

  @Get('/dias-disponiveis/:idGerenciaAgendamento/proximo-dia')
  @GetDoc('Agendamento', Roles.Publico)
  async proximoDiaDisponivel(
    @Param('idGerenciaAgendamento') idGerenciaAgendamento: string,
    @Query('inicio') inicio: Date,
  ) {
    return this.horariosAgendamentosService.getProximoDiaDisponivelByIdGerencia(
      idGerenciaAgendamento,
      inicio,
      1000,
    );
  }
}
