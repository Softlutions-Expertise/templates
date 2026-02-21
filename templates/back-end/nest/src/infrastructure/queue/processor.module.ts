import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilaQueueProcessor } from './fila-queue.processor';
import { FilaService } from '../../modules/fila/fila.service';
import { filaProvider } from '../../modules/fila/fila.provider';
import { escolaProvider } from '../../modules/providers/escola.provider';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'redis'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'fila-generation',
    }),
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
export class ProcessorModule {}
