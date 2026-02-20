import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { JwtAuthGuard } from '@/infrastructure/authentication/jwt-auth.guard';
import { AuditoriaInterceptor } from '@/apps/auditoria/interceptors/auditoria.interceptor';
import { Auditable } from '@/apps/auditoria/decorators/auditable.decorator';

// ----------------------------------------------------------------------

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaInterceptor)
@Auditable({ entidade: 'Category' })
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Auditable({ entidade: 'Category', ignorar: true })
  @ApiOperation({ summary: 'List all categories' })
  findAll(@Request() req) {
    return this.categoryService.findAll(req.user.userId);
  }

  @Get(':id')
  @Auditable({ entidade: 'Category', ignorar: true })
  @ApiOperation({ summary: 'Get category by id' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.categoryService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  create(@Body() dto: CreateCategoryDto, @Request() req) {
    return this.categoryService.create(dto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateCategoryDto, 
    @Request() req
  ) {
    // Busca a categoria original antes de atualizar
    const original = await this.categoryService.findOne(id, req.user.userId);
    
    // Atualiza
    const updated = await this.categoryService.update(id, dto, req.user.userId);
    
    // Retorna com _original para o diff
    return {
      ...updated,
      _original: original,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  async remove(@Param('id') id: string, @Request() req) {
    // Busca antes de deletar
    const original = await this.categoryService.findOne(id, req.user.userId);
    
    // Deleta
    await this.categoryService.remove(id, req.user.userId);
    
    // Retorna para auditoria
    return {
      id,
      ...original,
      _deleted: true,
    };
  }
}
