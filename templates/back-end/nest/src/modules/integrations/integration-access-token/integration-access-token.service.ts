import { Injectable, NotFoundException } from '@nestjs/common';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { randomBytes } from 'node:crypto';
import { v4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import {
  FULL_COMPARE_ENUMERABLE,
  FULL_COMPARE_NUMERIC,
} from '../../../helpers/paginate-utils';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { CreateIntegrationAccessTokenDto } from './dto/create-integration-access-token.dto';
import { UpdateIntegrationAccessTokenDto } from './dto/update-integration-access-token.dto';
import { IntegrationAccessTokenEntity } from './entities/integration-access-token.entity';
import { create } from 'node:domain';

export const CDV_AT_V1_RANDOM_BYTES = 32;
export const CDV_AT_V1_PREFIX = `cdv_at-v1-`;

export const CDV_AT_V1_TOTAL_LENGTH =
  CDV_AT_V1_PREFIX.length + CDV_AT_V1_RANDOM_BYTES * 2;

export const isCDVAccessTokenV1 = (accessToken: unknown) => {
  if (typeof accessToken !== 'string') return false;

  return (
    accessToken.length === CDV_AT_V1_TOTAL_LENGTH &&
    accessToken.startsWith(CDV_AT_V1_PREFIX)
  );
};

@Injectable()
export class IntegrationAccessTokenService {
  constructor(private databaseContextService: DatabaseContextService) {}

  get repository() {
    return this.databaseContextService.integrationAccessToken;
  }

  async findOneByToken(acessoControl: AcessoControl | null, token: string) {
    const target = await this.repository.findOne({
      where: { token },
      relations: {
        funcionarioAutor: {
          pessoa: true,
        },

        herdaPermissoesDeFuncionario: {
          pessoa: true,
        },
      },
    });

    if (target && acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'integration_access_token:read',
        this.repository.createQueryBuilder('integration_access_token'),
        target.id,
      );
    }

    return target;
  }

  async generateNewV1Token() {
    let token: string;
    let tokenAvailable = false;

    do {
      token = `${CDV_AT_V1_PREFIX}${randomBytes(
        CDV_AT_V1_RANDOM_BYTES,
      ).toString('hex')}`;

      const count = await this.repository.count({ where: { token } });
      tokenAvailable = count === 0;
    } while (!tokenAvailable);

    return token;
  }

  async create(
    acessoControl: AcessoControl,
    dto: CreateIntegrationAccessTokenDto,
  ) {
    const token = await this.generateNewV1Token();

    const funcionarioAutor = <FuncionarioEntity>{
      id: acessoControl.currentFuncionario.id,
    };

    const data: Partial<IntegrationAccessTokenEntity> = {
      ...dto,
      token,
      funcionarioAutor,
    };

    const integrationAccessToken = await this.repository.save({
      ...data,
      id: v4(),
    });

    return integrationAccessToken;
  }

  async update(
    acessoControl: AcessoControl,
    id: string,
    data: UpdateIntegrationAccessTokenDto,
  ) {
    const { ...currentEntity } = await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'integration_access_token:update',
      this.repository.createQueryBuilder('integration_access_token'),
      id,
      data,
    );

    const preloadedEntity = await this.repository.preload({
      ...currentEntity,
      ...data,
      funcionarioAutor: currentEntity.funcionarioAutor,
      id,
    });

    const integrationAccessToken = await this.repository.save(preloadedEntity);

    return integrationAccessToken;
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<IntegrationAccessTokenEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: {
        funcionarioAutor: {
          pessoa: true,
        },

        herdaPermissoesDeFuncionario: {
          pessoa: true,
        },
      },
    });

    if (!entity) {
      throw new NotFoundException(`integration access token não encontrada`);
    }

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'integration_access_token:read',
        this.repository.createQueryBuilder('integration_access_token'),
        id,
      );
    }

    return entity;
  }

  async findAll(
    acessoControl: AcessoControl | null,
    query: PaginateQuery,
  ): Promise<Paginated<IntegrationAccessTokenEntity>> {
    const qb = this.repository.createQueryBuilder('integration_access_token');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'integration_access_token:read',
        qb,
      );
    }

    return paginate(query, qb, {
      ...paginateConfig,

      sortableColumns: [
        'descricao',
        'validoAte',

        'createdAt',
        'updatedAt',

        'funcionarioAutor.pessoa.nome',
        'herdaPermissoesDeFuncionario.pessoa.nome',
      ],

      relations: {
        funcionarioAutor: {
          pessoa: true,
        },

        herdaPermissoesDeFuncionario: {
          pessoa: true,
        },
      },

      defaultSortBy: [['createdAt', 'DESC']],

      searchableColumns: ['descricao'],

      filterableColumns: {
        id: FULL_COMPARE_ENUMERABLE,

        'funcionarioAutor.id': FULL_COMPARE_ENUMERABLE,
        'herdaPermissoesDeFuncionario.id': FULL_COMPARE_ENUMERABLE,

        validoAte: FULL_COMPARE_NUMERIC,
        createdAt: FULL_COMPARE_NUMERIC,
      },
    });
  }

  async remove(acessoControl: AcessoControl | null, id: string) {
    const entity = await this.findOne(acessoControl, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'integration_access_token:delete',
        this.repository.createQueryBuilder('integration_access_token'),
        id,
      );
    }

    await this.repository.remove(entity);
  }
}
