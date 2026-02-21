import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Expense } from './entities/expense.entity';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';

// ----------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpensesModule {}
