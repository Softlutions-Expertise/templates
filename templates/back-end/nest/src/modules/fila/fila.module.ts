import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../database/database.module';
import { BaseModule } from '../base/base.module';
import { CriteriosConfiguracaoModule } from '../configuracao-criterio/criterios-configuracao.module';
import { EntrevistaModule } from '../entrevista/entrevista.module';
import { escolaProvider } from '../providers/escola.provider';
import { ReservaVagaModule } from '../reserva-vaga/reserva-vaga.module';
import { FilaAnalyticsService } from './fila-analytics.service';
import { FilaController } from './fila.controller';
import { filaProvider } from './fila.provider';
import { FilaService } from './fila.service';

@Module({})
export class FilaModule {
  static register(): DynamicModule {
    const imports = [
      ConfigModule,
      CriteriosConfiguracaoModule,
      BaseModule,
      DatabaseModule,
      EntrevistaModule,
      ReservaVagaModule,
    ];

    // Incluir QueueModule se estiver em modo queue e não for worker
    if (process.env.QUEUE_MODE === 'queue' && !process.env.WORKER_MODE) {
      try {
        const { QueueModule } = require('../../infrastructure/queue/queue.module');
        imports.push(QueueModule);
      } catch (error) {
        console.warn('QueueModule not available, using sync mode');
      }
    }

    return {
      module: FilaModule,
      imports,
      controllers: [FilaController],
      providers: [
        ...filaProvider,
        ...escolaProvider,
        FilaService,
        FilaAnalyticsService,
      ],
      exports: [...filaProvider, FilaService],
    };
  }
}
