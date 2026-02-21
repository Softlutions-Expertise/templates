import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { filaProvider } from '../fila/fila.provider';
import { agendamentoProvider } from '../providers/agendamento.provider';
import { entrevistaProvider } from '../providers/entrevista.provider';
import { escolaProvider } from '../providers/escola.provider';
import { etapaProvider } from '../providers/etapa.provider';
import { pessoaProvider } from '../providers/pessoa.provider';
import { reserva_vagaProvider } from '../providers/reserva-vaga.provider';
import { secretaria_municipal_etapaProvider } from '../providers/secretaria-municipal-etapa.provider';
import { secretaria_municipalProvider } from '../providers/secretaria-municipal.provider';
import { ReportController } from './report.controller';
import { ReportAgendamentoService } from './services/report-agendamento.service';
import { ReportEntrevistaService } from './services/report-entrevista.service';
import { ReportFilaService } from './services/report-fila.service';
import { ReportReservaVagaService } from './services/report-reserva-vaga.service';
import { ReportVagaService } from './services/report-vaga.service';
import { ReportService } from './services/report.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportController],
  providers: [
    ReportService,
    ReportAgendamentoService,
    ReportFilaService,
    ReportVagaService,
    ReportReservaVagaService,
    ReportEntrevistaService,
    ...secretaria_municipalProvider,
    ...escolaProvider,
    ...entrevistaProvider,
    ...secretaria_municipal_etapaProvider,
    ...pessoaProvider,
    ...agendamentoProvider,
    ...filaProvider,
    ...etapaProvider,
    ...reserva_vagaProvider,
  ],
})
export class ReportModule {}
