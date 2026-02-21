import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ValidatorModule } from '../../helpers/validators/validator.module';
import { BaseModule } from '../base/base.module';
import { CriteriosConfiguracaoModule } from '../configuracao-criterio/criterios-configuracao.module';
import { EntrevistaModule } from '../entrevista/entrevista.module';
import { FeriadosModule } from '../feriados/feriados.module';
import { agendamentoProvider } from '../providers/agendamento.provider';
import { AgendamentoController } from './controllers/agendamento.controller';
import { DiasNaoUteisController } from './controllers/dias-nao-uteis.controller';
import { GerenciaAgendamentoController } from './controllers/gerencia-agendamento.controller';
import { HorariosAgendamentoController } from './controllers/horarios-agendamento.controller';
import { AgendamentoEvent } from './events/agendamento.event';
import { AgendamentoService } from './services/agendamento.service';
import { DiasNaoUteisSyncService } from './services/dias-nao-uteis-sync.service';
import { DiasNaoUteisService } from './services/dias-nao-uteis.service';
import { GerenciaAgendamentoService } from './services/gerencia-agendamentos.service';
import { HorariosAgendamentoService } from './services/horarios-agendamento.service';
@Module({
  imports: [
    DatabaseModule,
    ValidatorModule,
    BaseModule,
    CriteriosConfiguracaoModule,
    EntrevistaModule,
    FeriadosModule,
  ],
  controllers: [
    GerenciaAgendamentoController,
    AgendamentoController,
    HorariosAgendamentoController,
    DiasNaoUteisController,
  ],
  providers: [
    ...agendamentoProvider,
    GerenciaAgendamentoService,
    AgendamentoService,
    DiasNaoUteisService,
    DiasNaoUteisSyncService,
    AgendamentoEvent,
    HorariosAgendamentoService,
  ],
  exports: [
    AgendamentoService,
    GerenciaAgendamentoService,
    HorariosAgendamentoService,
    DiasNaoUteisSyncService,
  ],
})
export class GerenciaAgendamentoModule { }
