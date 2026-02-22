import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../database/database.module';

/**
 * Worker Module - Template para processamento em background
 * 
 * Adicione controllers e services conforme necessário para:
 * - Jobs agendados
 * - Processamento de filas
 * - Tarefas assíncronas
 */
@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class WorkerModule {}
