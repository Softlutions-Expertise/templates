import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arquivo } from './entities/arquivo.entity';

export interface CreateArquivoDto {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  bucket: string;
  path: string;
  entityType?: string;
  entityId?: string;
  createdBy?: string;
}

@Injectable()
export class ArquivoService {
  constructor(
    @InjectRepository(Arquivo)
    private arquivoRepository: Repository<Arquivo>,
  ) {}

  async create(data: CreateArquivoDto): Promise<Arquivo> {
    const arquivo = this.arquivoRepository.create({
      originalName: data.originalName,
      fileName: data.fileName,
      mimeType: data.mimeType,
      size: data.size,
      url: data.url,
      bucket: data.bucket,
      path: data.path,
      entityType: data.entityType,
      entityId: data.entityId,
      createdBy: data.createdBy,
    });

    return this.arquivoRepository.save(arquivo);
  }

  async findAll(): Promise<Arquivo[]> {
    return this.arquivoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Arquivo> {
    const arquivo = await this.arquivoRepository.findOne({
      where: { id },
    });

    if (!arquivo) {
      throw new NotFoundException('File not found');
    }

    return arquivo;
  }

  async findByEntity(entityType: string, entityId: string): Promise<Arquivo[]> {
    return this.arquivoRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const arquivo = await this.findOne(id);
    await this.arquivoRepository.remove(arquivo);
  }
}
