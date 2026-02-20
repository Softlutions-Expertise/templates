import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateContatoDto } from '../dto/create-contato.dto';
import { ContatoEntity } from '../entities/contato.entity';

@Injectable()
export class ContatoService {
  constructor(
    @Inject('CONTATO_REPOSITORY')
    private repository: Repository<ContatoEntity>,
  ) {}

  async create(data: any): Promise<ContatoEntity> | null {
    const _data = this.checkPropriety(data);

    if (_data === null) return null;
    _data.id = uuidv4();

    return this.repository.save(_data);
  }

  async createOrUpdate(data: any, id?: string): Promise<ContatoEntity> | null {
    let _data = data;
    if (_data === null) return null;

    if (id !== undefined) {
      _data = this.checkPropriety(data);

      _data = await this.repository.preload({
        id: id,
        ..._data,
      });
    } else _data.id = uuidv4();
    return this.repository.save(_data);
  }

  private checkPropriety(data: any): CreateContatoDto | null {
    if (data !== undefined) return data.contato;

    return null;
  }
}
