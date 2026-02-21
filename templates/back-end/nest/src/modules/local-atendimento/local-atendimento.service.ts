import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { paginateConfig } from '../../config/paginate.config';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SecretariaMunicipalEntity } from '../secretaria-municipal/entities/secretaria-municipal.entity';
import { LocalAtendimentoDto } from './dto/local-atendimento.dto';
import { LocalAtendimentoEntity } from './local-atendimento.entity';

@Injectable()
export class LocalAtendimentoService {
  constructor(
    @Inject('LOCAL_ATENDIMENTO_REPOSITORY')
    private repository: Repository<LocalAtendimentoEntity>,
    @Inject('SECRETARIA_MUNICIPAL_REPOSITORY')
    private repositorySecretariaMunicipal: Repository<SecretariaMunicipalEntity>,
  ) {}

  async findOne(
    acessoControl: AcessoControl,
    id: string,
  ): Promise<LocalAtendimentoEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['endereco', 'endereco.cidade', 'contato'],
    });

    await acessoControl.ensureCanReachTarget(
      'secretaria:read',
      this.repositorySecretariaMunicipal.createQueryBuilder('secretaria'),
      entity?.secretariaMunicipal?.id,
    );

    if (!entity) {
      throw new NotFoundException(`Local de atendimento ${id} não encontrado.`);
    }

    return entity;
  }

  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
  ): Promise<Paginated<LocalAtendimentoEntity>> {
    const qb = this.repository.createQueryBuilder('secretaria');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      null,
      qb,
    );

    return paginate(query, this.repository, {
      ...paginateConfig,
      relations: [
        'endereco',
        'endereco.cidade',
        'contato',
        'secretariaMunicipal',
      ],
      searchableColumns: ['nome'],
      filterableColumns: {
        ativo: [FilterOperator.EQ],
        'endereco.cidade.id': [FilterOperator.EQ],
      },
    });
  }

  async createOrUpdate(
    localAtendimento: LocalAtendimentoDto,
  ): Promise<LocalAtendimentoEntity> {
    let data = localAtendimento;
    if (data === null) return null;

    if (data.id) {
      data = await this.repository.create({
        id: localAtendimento.id,
        ...localAtendimento,
      });
    } else data.id = uuidv4();

    return await this.repository.save(data);
  }
}
