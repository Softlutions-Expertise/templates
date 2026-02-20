import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportProcessor } from './report.processor';
import { Expense } from '@/apps/expenses/entities/expense.entity';
import { Category } from '@/apps/categories/entities/category.entity';

// ----------------------------------------------------------------------

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, Category]),
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
