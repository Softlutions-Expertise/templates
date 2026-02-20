import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { SelectQueryBuilder } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import { CreateCriteriosDto } from '../dto/create-criterios';
import { UpdateCriteriosDto } from '../dto/update-criterios';
import { CriteriosEntity } from '../entities/criterios.entity';

@Injectable()
export class CriteriosService {
  constructor(private databaseContextService: DatabaseContextService) {}

  get criterioRepository() {
    return this.databaseContextService.criterioRepository;
  }

  static CriterioQueryBuilderView(
    alias: string,
    qb: SelectQueryBuilder<any>,
    {
      joinSecretaria = true,
      joinConfiguracoesCriterio = true,
      joinCurrentConfiguracaoCriterio = true,
    }: {
      joinSecretaria: boolean;
      joinConfiguracoesCriterio: boolean;
      joinCurrentConfiguracaoCriterio: boolean;
    },
  ) {
    qb.addSelect([`${alias}.id`, `${alias}.nome`]);

    if (joinSecretaria) {
      qb.leftJoin(`${alias}.secretariaMunicipal`, `${alias}_secretaria_rel`);

      qb.addSelect([
        //
        `${alias}_secretaria_rel.id`,
        `${alias}_secretaria_rel.cnpj`,
        `${alias}_secretaria_rel.razaoSocial`,
        `${alias}_secretaria_rel.nomeFantasia`,
        `${alias}_secretaria_rel.createdAt`,
        `${alias}_secretaria_rel.updatedAt`,
      ]);
    }

    if (joinConfiguracoesCriterio) {
      qb.leftJoin(
        `${alias}.configuracoesCriterio`,
        `${alias}_configuracao_criterio_rel`,
      );

      qb.addSelect([
        //
        `${alias}_configuracao_criterio_rel.id`,
        `${alias}_configuracao_criterio_rel.notaTecnica`,
        `${alias}_configuracao_criterio_rel.posicao`,
        `${alias}_configuracao_criterio_rel.subPosicao`,
        `${alias}_configuracao_criterio_rel.exigirComprovacao`,
      ]);

      qb.leftJoin(
        `${alias}_configuracao_criterio_rel.criteriosConfiguracao`,
        `${alias}_configuracao_criterio_rel_criterios_configuracao`,
      );

      qb.addSelect([
        //
        `${alias}_configuracao_criterio_rel_criterios_configuracao.id`,
        `${alias}_configuracao_criterio_rel_criterios_configuracao.dataVigenciaInicio`,
        `${alias}_configuracao_criterio_rel_criterios_configuracao.dataVigenciaFim`,
      ]);
    }

    if (joinCurrentConfiguracaoCriterio) {
      qb.leftJoinAndMapOne(
        `${alias}.currentConfiguracaoCriterio_rel`,
        `${alias}.configuracoesCriterio`,
        `${alias}_currentConfiguracaoCriterio_rel`,
        `${alias}_currentConfiguracaoCriterio_rel.id = get_current_configuracao_criterio_id_by_criterio_id_with_now(${alias}.id, :now)`,
        { now: new Date() },
      );

      qb.addSelect([
        //
        `${alias}_currentConfiguracaoCriterio_rel.id`,
        `${alias}_currentConfiguracaoCriterio_rel.notaTecnica`,
        // `${alias}_currentConfiguracaoCriterio_rel.posicao`,
        // `${alias}_currentConfiguracaoCriterio_rel.subPosicao`,
        `${alias}_currentConfiguracaoCriterio_rel.exigirComprovacao`,
      ]);
    }
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<CriteriosEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'criterio:read',
        this.criterioRepository.createQueryBuilder('criterio'),
        id,
      );
    }

    const qb = this.criterioRepository.createQueryBuilder('criterio');

    qb.select([]);

    CriteriosService.CriterioQueryBuilderView('criterio', qb, {
      joinSecretaria: true,
      joinConfiguracoesCriterio: true,
      joinCurrentConfiguracaoCriterio: true,
    });

    qb.andWhere('criterio.id = :criterioId', { criterioId: id });

    const criterio = await qb.getOne();

    if (!criterio) {
      throw new NotFoundException(`Critério não encontrado`);
    }

    return criterio;
  }

  async findAll(
    acessoControl: AcessoControl | null,
    query: PaginateQuery,
  ): Promise<Paginated<CriteriosEntity>> {
    const qb = this.criterioRepository.createQueryBuilder('criterio');

    qb.select([]);

    CriteriosService.CriterioQueryBuilderView('criterio', qb, {
      joinSecretaria: true,
      joinConfiguracoesCriterio: false,
      joinCurrentConfiguracaoCriterio: true,
    });

    /**
     * A alteração realizada no método `findAll` do serviço CriteriosService é necessária para adaptar o comportamento
     * do query builder (`qb`) ao usar a função `paginate` do pacote `nestjs-paginate`. A modificação é feita na função
     * `qb.leftJoinAndSelect`, onde é verificado se a relação inclui a string 'currentConfiguracaoCriterio'. Caso não inclua,
     * a função original `originalLeftJoinAndSelect` é chamada. Essa mudança é crucial para garantir que o pacote de paginação
     * `nestjs-paginate` considere corretamente a relação criada com `qb.leftJoinAndMapOne` para 'currentConfiguracaoCriterio'.
     * Sem essa adaptação, a paginação poderia não funcionar conforme esperado, afetando a busca e ordenação dos resultados.
     */

    const originalLeftJoinAndSelect = qb.leftJoinAndSelect;

    qb.leftJoinAndSelect = function (...args: any[]) {
      if (!args[0].includes('currentConfiguracaoCriterio')) {
        return originalLeftJoinAndSelect.apply(this, args);
      }
    } as any;

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'criterio:read',
        qb,
      );
    }

    const paginated = await paginate(query, qb, {
      ...paginateConfig,
      defaultSortBy: [
        ['secretariaMunicipal.nomeFantasia', 'ASC'],
        ['currentConfiguracaoCriterio.posicao', 'ASC'],
        ['currentConfiguracaoCriterio.subPosicao', 'ASC'],
      ],
      relations: {
        secretariaMunicipal: true,
        currentConfiguracaoCriterio: true,
      },
      searchableColumns: [
        'criterio.nome',
        'secretariaMunicipal.nomeFantasia',
        'secretariaMunicipal.razaoSocial',
        'currentConfiguracaoCriterio.notaTecnica',
        'currentConfiguracaoCriterio.posicao',
        'currentConfiguracaoCriterio.subPosicao',
        'currentConfiguracaoCriterio.exigirComprovacao',
      ],
      filterableColumns: {
        'secretariaMunicipal.id': [FilterOperator.EQ],
        'currentConfiguracaoCriterio.notaTecnica': [FilterOperator.EQ],
        'currentConfiguracaoCriterio.exigirComprovacao': [FilterOperator.EQ],
      },
    });

    paginated.data = paginated.data
      .map(
        ({
          currentConfiguracaoCriterio,
          currentConfiguracaoCriterio_rel,
          ...rest
        }: any): CriteriosEntity => ({
          ...rest,
          currentConfiguracaoCriterio:
            currentConfiguracaoCriterio ?? currentConfiguracaoCriterio_rel,
        }),
      )
      .filter((item) => item.currentConfiguracaoCriterio)
      .sort((a, b) => {
        const confA = a.currentConfiguracaoCriterio;
        const confB = b.currentConfiguracaoCriterio;

        if (confA && !confB) {
          return -1;
        }

        if (confB && !confA) {
          return 1;
        }

        if (!confA && !confB) {
          return 0;
        }

        const diff = confA.posicao - confB.posicao;

        if (diff !== 0) {
          return diff;
        }

        const subConfA = confA.subPosicao;
        const subConfB = confB.subPosicao;

        return subConfA - subConfB;
      });

    return paginated;
  }

  async create(acessoControl: AcessoControl | null, data: CreateCriteriosDto) {
    if (acessoControl) {
      await acessoControl.ensureCanPerform('criterio:create', data);
    }

    const criterios_data = this.criterioRepository.create({
      ...data,
      id: uuidv4(),
    });

    return this.criterioRepository.save(criterios_data);
  }

  async update(
    acessoControl: AcessoControl | null,
    id: string,
    data: UpdateCriteriosDto,
  ): Promise<CriteriosEntity> {
    const entity = await this.findOne(acessoControl, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'criterio:update',
        this.criterioRepository.createQueryBuilder('criterio'),
        id,
        data,
      );
    }

    const criterios_data = this.criterioRepository.merge(entity, data);

    return this.criterioRepository.save(criterios_data);
  }

  async remove(acessoControl: AcessoControl | null, id: string) {
    const criterio = await this.findOne(acessoControl, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'criterio:delete',
        this.criterioRepository.createQueryBuilder('criterio'),
        id,
      );
    }

    return this.criterioRepository.remove(criterio);
  }
}
