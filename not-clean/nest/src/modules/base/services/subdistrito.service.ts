import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { SubdistritoEntity } from '../entities/subdistrito.entity';
import { CreateSubdistritoDto } from '../dto/create-subdistrito.dto';
import axios from 'axios';

@Injectable()
export class SubdistritoService {
  constructor(
    @Inject('SUBDISTRITO_REPOSITORY')
    private repository: Repository<SubdistritoEntity>,
  ) { }

  async findOne(id: string): Promise<SubdistritoEntity> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`SubDistrito with ID ${id} not found`);
    }

    return entity;
  }

  async createOrUpdate(
    data: CreateSubdistritoDto,
    id?: string,
  ): Promise<SubdistritoEntity | null> {
    if (!data) {
      return null;
    }
    /// verificar se o subdistrito ja existe
    const subdistrito = await this.repository.findOne({
      where: { id: data.id },
    });
    if (!subdistrito) {
      data.nome = await this.getDistrito(data.id);

      let entityToUpdate;
      if (id) {
        entityToUpdate = await this.repository.preload({
          id,
          ...data,
        });
      }

      try {
        return await this.repository.save(entityToUpdate || data);
      } catch (error) {
        console.error(error);
      }
    }
    
  }

  async getDistrito(id: string): Promise<string> {
    const url = `http://servicodados.ibge.gov.br/api/v1/localidades/subdistritos/${id}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      if (data && data[0] && data[0].nome) {
        return data[0].nome;
      } else {
        throw new Error('Nome not found in response');
      }
    } catch (error) {
      throw new BadRequestException(
        `Could not fetch Distrito: ${error.message}`,
      );
    }
  }
}
