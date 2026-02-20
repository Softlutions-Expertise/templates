import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { paginate, PaginateQuery, Paginated, FilterOperator } from 'nestjs-paginate';

import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseFilterDto } from '../dto';

// ----------------------------------------------------------------------

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async findAll(query: PaginateQuery, userId: string, filters?: ExpenseFilterDto): Promise<Paginated<Expense>> {
    const where: any = { userId };

    if (filters?.startDate && filters?.endDate) {
      where.date = Between(filters.startDate, filters.endDate);
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    return paginate(query, this.expenseRepository, {
      sortableColumns: ['date', 'amount', 'createdAt', 'description'],
      searchableColumns: ['description', 'notes'],
      defaultSortBy: [['date', 'DESC']],
      filterableColumns: {
        description: [FilterOperator.CONTAINS],
        amount: [FilterOperator.GTE, FilterOperator.LTE],
        date: [FilterOperator.GTE, FilterOperator.LTE],
      },
      relations: ['category'],
      where,
    });
  }

  async findRecent(userId: string, limit: number = 5): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: limit,
      relations: ['category'],
    });
  }

  async findOne(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async create(dto: CreateExpenseDto, userId: string): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...dto,
      userId,
      date: new Date(dto.date),
    });

    return this.expenseRepository.save(expense);
  }

  async update(id: string, dto: UpdateExpenseDto, userId: string): Promise<Expense> {
    const expense = await this.findOne(id, userId);
    
    const updateData: any = { ...dto };
    if (dto.date) {
      updateData.date = new Date(dto.date);
    }

    this.expenseRepository.merge(expense, updateData);
    return this.expenseRepository.save(expense);
  }

  async remove(id: string, userId: string): Promise<void> {
    const expense = await this.findOne(id, userId);
    await this.expenseRepository.softRemove(expense);
  }

  async getMonthlyStats(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await this.expenseRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
      relations: ['category'],
    });

    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    const byCategory = expenses.reduce((acc, expense) => {
      const categoryName = expense.category?.name || 'Sem categoria';
      const categoryColor = expense.category?.color || '#999999';
      
      if (!acc[categoryName]) {
        acc[categoryName] = { amount: 0, color: categoryColor, count: 0 };
      }
      acc[categoryName].amount += Number(expense.amount);
      acc[categoryName].count += 1;
      return acc;
    }, {});

    return {
      total,
      count: expenses.length,
      byCategory: Object.entries(byCategory).map(([name, data]: [string, any]) => ({
        name,
        ...data,
      })),
    };
  }
}
