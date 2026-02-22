import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../database/database.module';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
