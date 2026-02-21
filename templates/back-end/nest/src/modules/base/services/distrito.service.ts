import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { DistritoEntity } from '../entities/distrito.entity';
import { CreateDistritoDto } from '../dto/create-distrito.dto';
import axios from 'axios';

@Injectable()
export class DistritoService {
  constructor(
    @Inject('DISTRITO_REPOSITORY')
    private repository: Repository<DistritoEntity>,
  ) { }

  async findOne(id: number): Promise<DistritoEntity> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Distrito with ID ${id} not found`);
    }

    return entity;
  }

  async createOrUpdate(
    data: CreateDistritoDto,
    id?: string,
  ): Promise<DistritoEntity | null> {
    if (!data) {
      return null;
    }
    //verificar se o distrito ja existe
    const distrito = await this.repository.findOne({
      where: { id: data.id },
    });
    if (!distrito) {
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

  async getDistrito(id: number): Promise<string> {
    const url = `http://servicodados.ibge.gov.br/api/v1/localidades/distritos/${id}`;
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
