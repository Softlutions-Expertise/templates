import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportProcessor } from './report.processor';
import { Report } from './entities/report.entity';
import { MinioService } from '../storage/minio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    BullModule.registerQueue({
      name: 'reports',
    }),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportProcessor, MinioService],
})
export class ReportsModule {}
