import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Example, ExampleStatus } from '../entities/example.entity';
import { CreateExampleDto } from '../dto/create-example.dto';
import { UpdateExampleDto } from '../dto/update-example.dto';
import { ExampleFilterDto } from '../dto/example-filter.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private exampleRepository: Repository<Example>,
  ) {}

  async create(
    createExampleDto: CreateExampleDto,
    userId?: string,
  ): Promise<Example> {
    const existing = await this.exampleRepository.findOne({
      where: { name: createExampleDto.name },
    });

    if (existing) {
      throw new ConflictException('Example with this name already exists');
    }

    const example = this.exampleRepository.create({
      ...createExampleDto,
      createdBy: userId,
    });

    return this.exampleRepository.save(example);
  }

  async findAll(filter: ExampleFilterDto): Promise<PaginatedResult<Example>> {
    const { search, status, page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [data, total] = await this.exampleRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Example> {
    const example = await this.exampleRepository.findOne({
      where: { id },
    });

    if (!example) {
      throw new NotFoundException('Example not found');
    }

    return example;
  }

  async update(
    id: string,
    updateExampleDto: UpdateExampleDto,
  ): Promise<Example> {
    const example = await this.findOne(id);

    if (
      updateExampleDto.name &&
      updateExampleDto.name !== example.name
    ) {
      const existing = await this.exampleRepository.findOne({
        where: { name: updateExampleDto.name },
      });

      if (existing) {
        throw new ConflictException('Example with this name already exists');
      }
    }

    Object.assign(example, updateExampleDto);
    return this.exampleRepository.save(example);
  }

  async remove(id: string): Promise<void> {
    const example = await this.findOne(id);
    await this.exampleRepository.softRemove(example);
  }

  async restore(id: string): Promise<Example> {
    const example = await this.exampleRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!example) {
      throw new NotFoundException('Example not found');
    }

    return this.exampleRepository.save({
      ...example,
      deletedAt: null,
    });
  }

  async updateStatus(id: string, status: ExampleStatus): Promise<Example> {
    const example = await this.findOne(id);
    example.status = status;
    return this.exampleRepository.save(example);
  }
}
