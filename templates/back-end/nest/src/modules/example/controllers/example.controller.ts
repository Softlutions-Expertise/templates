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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Paginate } from 'nestjs-paginate';

import { ExampleService } from '../services/example.service';
import { CreateExampleDto, UpdateExampleDto } from '../dto';
import { JwtAuthGuard } from '@/infrastructure/authentication/jwt-auth.guard';

// ----------------------------------------------------------------------

@ApiTags('examples')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  @ApiOperation({ summary: 'List all examples with pagination' })
  findAll(@Paginate() query, @Request() req) {
    return this.exampleService.findAll(query, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get example by id' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.exampleService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new example' })
  create(@Body() dto: CreateExampleDto, @Request() req) {
    return this.exampleService.create(dto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update example' })
  update(@Param('id') id: string, @Body() dto: UpdateExampleDto, @Request() req) {
    return this.exampleService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete example' })
  remove(@Param('id') id: string, @Request() req) {
    return this.exampleService.remove(id, req.user.userId);
  }
}
