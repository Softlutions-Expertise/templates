import {
  //BadRequestException, #NO SONAR
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import { LimparCpf } from '../../../helpers/functions/Mask';
import { CreateResponsavelDto } from '../dto/create-responsavel.dto';
import { UpdateResponsavelDto } from '../dto/update-responsavel.dto';
import { ResponsavelEntity } from '../entities/resposalvel.entity';

@Injectable()
export class ResponsavelService {
  constructor(
    @Inject('RESPONSAVEL_CRIANCA_REPOSITORY')
    private repository: Repository<ResponsavelEntity>,
  ) {}

  async findOne(id: string): Promise<ResponsavelEntity> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Responsável não encontrado`);
    }

    return entity;
  }

  async findAll(query: PaginateQuery): Promise<Paginated<ResponsavelEntity>> {
    return paginate(query, this.repository, {
      ...paginateConfig,
    });
  }

  async create(data: CreateResponsavelDto): Promise<ResponsavelEntity> {
    data.cpfRes = LimparCpf(data.cpfRes);

    // const cpf = await this.repository.findOne({
    //   where: { cpfRes: data.cpfRes },
    // });#NO SONAR

    // if (cpf) {
    //   throw new BadRequestException(`Responsavel com mesmo cpf já cadastrado`);
    // } #NO SONAR
    const resp = this.repository.create({
      ...data,
      id: uuidv4(),
    });

    return this.repository.save(resp);
  }

  async update(id: string, data: UpdateResponsavelDto) {
    if (data.cpfRes) {
      data.cpfRes = LimparCpf(data.cpfRes);
    }

    const responsavel = await this.findOne(id);

    const entity = await this.repository.preload({
      id: responsavel.id,
      ...data,
    });

    return this.repository.save(entity);
  }

  async createOrUpdate(
    data: any,
    id?: string,
  ): Promise<ResponsavelEntity> | null {
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

  private checkPropriety(data: any) {
    if (data !== undefined) return data;

    return null;
  }
}
