import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Paginate } from 'nestjs-paginate';

import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseFilterDto } from '../dto';
import { JwtAuthGuard } from '@/infrastructure/authentication/jwt-auth.guard';
import { AuditoriaInterceptor } from '@/modules/auditoria/interceptors/auditoria.interceptor';
import { Auditable } from '@/modules/auditoria/decorators/auditable.decorator';

// ----------------------------------------------------------------------

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaInterceptor)
@Auditable({ entidade: 'Expense' })
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  @Auditable({ entidade: 'Expense', ignorar: true }) // Não audita listagens
  @ApiOperation({ summary: 'List all expenses with pagination' })
  findAll(
    @Paginate() query,
    @Request() req,
    @Query() filters: ExpenseFilterDto,
  ) {
    return this.expenseService.findAll(query, req.user.userId, filters);
  }

  @Get('recent')
  @Auditable({ entidade: 'Expense', ignorar: true })
  @ApiOperation({ summary: 'Get recent expenses' })
  findRecent(@Request() req, @Query('limit', ParseIntPipe) limit?: number) {
    return this.expenseService.findRecent(req.user.userId, limit);
  }

  @Get('stats/monthly')
  @Auditable({ entidade: 'Expense', ignorar: true })
  @ApiOperation({ summary: 'Get monthly statistics' })
  getMonthlyStats(
    @Request() req,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.expenseService.getMonthlyStats(req.user.userId, year, month);
  }

  @Get(':id')
  @Auditable({ entidade: 'Expense', ignorar: true })
  @ApiOperation({ summary: 'Get expense by id' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.expenseService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new expense' })
  create(@Body() dto: CreateExpenseDto, @Request() req) {
    return this.expenseService.create(dto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update expense' })
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateExpenseDto, 
    @Request() req
  ) {
    // Busca a despesa original antes de atualizar (para o diff)
    const original = await this.expenseService.findOne(id, req.user.userId);
    
    // Atualiza
    const updated = await this.expenseService.update(id, dto, req.user.userId);
    
    // Retorna com _original para o interceptor calcular o diff
    return {
      ...updated,
      _original: original,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense' })
  async remove(@Param('id') id: string, @Request() req) {
    // Busca a despesa antes de deletar (para o snapshot)
    const original = await this.expenseService.findOne(id, req.user.userId);
    
    // Deleta
    await this.expenseService.remove(id, req.user.userId);
    
    // Retorna o objeto deletado para o interceptor registrar
    return {
      id,
      ...original,
      _deleted: true,
    };
  }
}
