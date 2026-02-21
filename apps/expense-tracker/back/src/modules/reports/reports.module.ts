import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HttpModule } from '@nestjs/axios';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportProcessor } from './report.processor';
import { Expense } from '@/modules/expenses/entities/expense.entity';
import { Category } from '@/modules/categories/entities/category.entity';
import { Auditoria } from '@/modules/auditoria/entities/auditoria.entity';

// ----------------------------------------------------------------------

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Expense, Category, Auditoria]),
    BullModule.registerQueueAsync({
      name: 'reports',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportProcessor],
})
export class ReportsModule {}
