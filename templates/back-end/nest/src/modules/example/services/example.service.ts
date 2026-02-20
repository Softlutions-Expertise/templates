import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery, Paginated, FilterOperator } from 'nestjs-paginate';

import { Example } from '../entities/example.entity';
import { CreateExampleDto, UpdateExampleDto } from '../dto';

// ----------------------------------------------------------------------

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private exampleRepository: Repository<Example>,
  ) {}

  async findAll(query: PaginateQuery, userId: string): Promise<Paginated<Example>> {
    return paginate(query, this.exampleRepository, {
      sortableColumns: ['id', 'name', 'createdAt'],
      searchableColumns: ['name', 'description'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        name: [FilterOperator.CONTAINS],
        status: [FilterOperator.EQ],
      },
      where: { userId },
      relations: [],
    });
  }

  async findOne(id: string, userId: string): Promise<Example> {
    const example = await this.exampleRepository.findOne({
      where: { id, userId },
    });

    if (!example) {
      throw new NotFoundException('Example not found');
    }

    return example;
  }

  async create(dto: CreateExampleDto, userId: string): Promise<Example> {
    const example = this.exampleRepository.create({
      ...dto,
      userId,
    });
    return this.exampleRepository.save(example);
  }

  async update(id: string, dto: UpdateExampleDto, userId: string): Promise<Example> {
    const example = await this.findOne(id, userId);
    this.exampleRepository.merge(example, dto);
    return this.exampleRepository.save(example);
  }

  async remove(id: string, userId: string): Promise<void> {
    const example = await this.findOne(id, userId);
    await this.exampleRepository.softRemove(example);
  }
}
