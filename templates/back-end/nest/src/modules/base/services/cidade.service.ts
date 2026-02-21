import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { paginateConfig } from '../../../config/paginate.config';
import { CidadeEntity } from '../entities/cidade.entity';

@Injectable()
export class CidadeService {
  constructor(
    @Inject('CIDADE_REPOSITORY')
    private repository: Repository<CidadeEntity>,
  ) {}

  async findOne(id: CidadeEntity['id']): Promise<CidadeEntity> {
    const cidade = await this.repository.findOneBy({ id: id });

    if (!cidade) {
      throw new NotFoundException(`Cidade ${id} não encontrada`);
    }

    return cidade;
  }

  async getCityIdByName(name: string): Promise<CidadeEntity> {
    const city = await this.repository.findOne({ where: { nome: name } });
    return city;
  }

  async findByUf(
    uf: string,
    onlyWithConfiguredSecretarias = false,
  ): Promise<CidadeEntity[]> {
    const qb = this.repository.createQueryBuilder('cidade');

    qb.innerJoin('cidade.estado', 'estado');
    qb.where('estado.uf = :uf', { uf });
    qb.select(['cidade', 'estado']);

    if (onlyWithConfiguredSecretarias) {
      qb.innerJoin('cidade.enderecos', 'endereco');

      qb.innerJoin('endereco.secretariasMunicipais', 'secretaria_municipal');

      qb.innerJoin(
        'secretaria_municipal.gerenciaAgendamento',
        'gerencia_agendamento',
      );
    }

    const cidades = await qb.getMany();

    return cidades;
  }

  async findAll(query: PaginateQuery): Promise<Paginated<CidadeEntity>> {
    const qb = this.repository.createQueryBuilder('cidade');

    if (query?.filter?.secretariaMunicipalConfigurada === 'true') {
      qb.innerJoin('cidade.enderecos', 'endereco');

      qb.innerJoin('endereco.secretariasMunicipais', 'secretaria_municipal');

      qb.innerJoin('secretaria_municipal.locaisAtendimentos', 'local_atendimento');

      qb.innerJoin(
        'local_atendimento.gerenciaAgendamento',
        'gerencia_agendamento',
      );
      if (query?.filter?.['gerencia_agendamento.ativo']) {
        const isAtivo =
          query.filter['gerencia_agendamento.ativo'] === 'true' ? true : false;
        qb.andWhere('gerencia_agendamento.ativo = :ativo', { ativo: isAtivo });
      }
    }

    return paginate(query, qb, {
      ...paginateConfig,
      defaultSortBy: [['nome', 'ASC']],
      searchableColumns: ['nome', 'id'],
      relations: {
        estado: true,
      },
      filterableColumns: {
        'estado.uf': [FilterOperator.EQ],
        'estado.id': [FilterOperator.EQ],
      },
    });
  }
}
