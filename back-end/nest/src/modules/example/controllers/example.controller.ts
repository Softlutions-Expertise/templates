import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExampleService } from '../services/example.service';
import { CreateExampleDto } from '../dto/create-example.dto';
import { UpdateExampleDto } from '../dto/update-example.dto';
import { ExampleFilterDto } from '../dto/example-filter.dto';
import { JwtAuthGuard } from '../../../infrastructure/authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../../../infrastructure/authentication/decorators/current-user.decorator';
import { ICurrentUser } from '../../../infrastructure/authentication/authentication.service';

@ApiTags('Example')
@Controller('examples')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new example' })
  create(
    @Body() createExampleDto: CreateExampleDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.exampleService.create(createExampleDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all examples with pagination' })
  findAll(@Query() filter: ExampleFilterDto) {
    return this.exampleService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single example by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.exampleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an example' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExampleDto: UpdateExampleDto,
  ) {
    return this.exampleService.update(id, updateExampleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an example' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.exampleService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted example' })
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.exampleService.restore(id);
  }
}
