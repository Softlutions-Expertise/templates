import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { AuthModule } from './modules/auth/auth.module';
import { BaseModule } from './modules/base/base.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { MapsModule } from './modules/maps/maps.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PessoaModule } from './modules/pessoa/pessoa.module';
import { ReportModule } from './modules/report/report.module';
import { ScheduleService } from './modules/schedule/schedule.service';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    IntegrationsModule,
    InfrastructureModule,
    AuthModule,
    ScheduleModule.forRoot(),
    BaseModule,
    PessoaModule,
    MailerModule,
    WhatsAppModule,
    ReportModule,
    NotificationModule,
    MapsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScheduleService],
})
export class AppModule {}
