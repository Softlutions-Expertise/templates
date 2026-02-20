import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Expense } from '@/apps/expenses/entities/expense.entity';
import { DashboardController } from './dashboard.controller';

// ----------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [DashboardController],
})
export class DashboardModule {}
