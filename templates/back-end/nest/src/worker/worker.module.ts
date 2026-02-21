import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { ValidatorModule } from '../helpers/validators/validator.module';
import { AcessoControlModule } from '../infrastructure/acesso-control/acesso-control.module';
import { ArquivoModule } from '../infrastructure/arquivo/arquivo.module';
import { AuthorizationModule } from '../infrastructure/authorization';
import { DatabaseContextModule } from '../infrastructure/database-context/database-context-module.module';
import { WorkerQueueModule } from '../infrastructure/queue/worker-queue.module';
import { FilaQueueProcessor } from '../infrastructure/queue/fila-queue.processor';
import { BaseModule } from '../modules/base/base.module';
import { CriteriosConfiguracaoModule } from '../modules/configuracao-criterio/criterios-configuracao.module';
import { EntrevistaModule } from '../modules/entrevista/entrevista.module';
import { ReservaVagaModule } from '../modules/reserva-vaga/reserva-vaga.module';
import { FilaService } from '../modules/fila/fila.service';
import { filaProvider } from '../modules/fila/fila.provider';
import { escolaProvider } from '../modules/providers/escola.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DatabaseContextModule,
    AcessoControlModule,
    AuthorizationModule,
    ArquivoModule,
    ValidatorModule,
    BaseModule,
    CriteriosConfiguracaoModule,
    EntrevistaModule,
    ReservaVagaModule,
    WorkerQueueModule,
  ],
  providers: [
    ...filaProvider,
    ...escolaProvider,
    FilaService,
    FilaQueueProcessor,
    {
      provide: 'FilaService',
      useExisting: FilaService,
    },
  ],
})
export class WorkerModule {}
