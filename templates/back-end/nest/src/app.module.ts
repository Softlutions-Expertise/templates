import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { GerenciaAgendamentoModule } from './modules/agendamento/agendamento.module';
import { AuthModule } from './modules/auth/auth.module';
import { BaseModule } from './modules/base/base.module';
import { CriteriosConfiguracaoModule } from './modules/configuracao-criterio/criterios-configuracao.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DocumentoModule } from './modules/documento/documento.module';
import { EntrevistaModule } from './modules/entrevista/entrevista.module';
import { EscolaModule } from './modules/escola/escola.module';
import { EtapaModule } from './modules/etapa/etapa.module';
import { FeriadosModule } from './modules/feriados/feriados.module';
import { FilaModule } from './modules/fila/fila.module';
import { HorarioFuncionamentoModule } from './modules/horario-funcionamento/horario-funcionamento.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { LocalAtendimentoModule } from './modules/local-atendimento/local-atendimento.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { MapsModule } from './modules/maps/maps.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PessoaModule } from './modules/pessoa/pessoa.module';
import { ReportModule } from './modules/report/report.module';
import { ReservaVagaModule } from './modules/reserva-vaga/reserva-vaga.module';
import { ScheduleService } from './modules/schedule/schedule.service';
import { SecretariaMunicipalEtapaModule } from './modules/secretaria-municipal-etapa/secretaria-municipal-etapa.module';
import { SecretariaMunicipalModule } from './modules/secretaria-municipal/secretaria-municipal.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    IntegrationsModule,
    FeriadosModule,
    InfrastructureModule,
    AuthModule,
    ScheduleModule.forRoot(),
    BaseModule,
    PessoaModule,
    EscolaModule,
    SecretariaMunicipalModule,
    GerenciaAgendamentoModule,
    FilaModule.register(),
    EntrevistaModule,
    CriteriosConfiguracaoModule,
    ReservaVagaModule,
    MailerModule,
    WhatsAppModule,
    DashboardModule,
    EtapaModule,
    SecretariaMunicipalEtapaModule,
    ReportModule,
    NotificationModule,
    LocalAtendimentoModule,
    DocumentoModule,
    HorarioFuncionamentoModule,
    MapsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScheduleService],
})
export class AppModule {}
