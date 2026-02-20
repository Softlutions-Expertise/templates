import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtAuthGuard } from '@/infrastructure/authentication/jwt-auth.guard';
import { Expense } from '@/apps/expenses/entities/expense.entity';

// ----------------------------------------------------------------------

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary' })
  async getSummary(@Request() req) {
    const userId = req.user.userId;

    // Total do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyExpenses = await this.expenseRepository.find({
      where: {
        userId,
        deletedAt: null,
        date: Between(startOfMonth, endOfMonth),
      },
      relations: ['category'],
    });

    const totalMonth = monthlyExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

    // Total geral
    const allExpenses = await this.expenseRepository.find({
      where: { userId, deletedAt: null },
    });

    const totalAll = allExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

    // Por categoria no mês
    const byCategory = monthlyExpenses.reduce((acc, expense) => {
      const categoryName = expense.category?.name || 'Sem categoria';
      const categoryColor = expense.category?.color || '#999999';

      if (!acc[categoryName]) {
        acc[categoryName] = { amount: 0, color: categoryColor };
      }
      acc[categoryName].amount += Number(expense.amount);
      return acc;
    }, {});

    return {
      totalMonth,
      totalAll,
      countMonth: monthlyExpenses.length,
      countAll: allExpenses.length,
      byCategory: Object.entries(byCategory)
        .map(([name, data]: [string, any]) => ({
          name,
          ...data,
        }))
        .sort((a, b) => b.amount - a.amount),
    };
  }

  @Get('chart-data')
  @ApiOperation({ summary: 'Get data for charts' })
  async getChartData(@Request() req, @Query('months') months: number = 6) {
    const userId = req.user.userId;
    const now = new Date();
    const data = [];

    for (let i = months - 1; i >= 0; i--) {
      const year = now.getFullYear();
      const month = now.getMonth() - i;
      const date = new Date(year, month, 1);
      
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const expenses = await this.expenseRepository.find({
        where: {
          userId,
          deletedAt: null,
          date: Between(startOfMonth, endOfMonth),
        },
      });

      const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0,
      );

      data.push({
        month: date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }),
        total,
        count: expenses.length,
      });
    }

    return data;
  }
}
