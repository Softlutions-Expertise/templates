import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EstadoEntity } from '../entities/estado.entity';

@Injectable()
export class EstadoService {
  constructor(
    @Inject('ESTADO_REPOSITORY')
    private repository: Repository<EstadoEntity>,
  ) {}

  findAll(): Promise<EstadoEntity[]> {
    return this.repository.find();
  }

  async findOne(id: EstadoEntity['id']): Promise<EstadoEntity> {
    const estado = await this.repository.findOneBy({ id: id });

    if (!estado) {
      throw new NotFoundException(`Estado ${id} não encontrado`);
    }

    return estado;
  }
}
