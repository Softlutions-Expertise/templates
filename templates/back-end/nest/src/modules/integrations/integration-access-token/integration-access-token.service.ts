import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { randomBytes } from 'node:crypto';
import { v4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import {
  FULL_COMPARE_ENUMERABLE,
  FULL_COMPARE_NUMERIC,
} from '../../../helpers/paginate-utils';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { CreateIntegrationAccessTokenDto } from './dto/create-integration-access-token.dto';
import { UpdateIntegrationAccessTokenDto } from './dto/update-integration-access-token.dto';
import { IntegrationAccessTokenEntity } from './entities/integration-access-token.entity';

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
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {}

  get repository() {
    return this.dataSource.getRepository(IntegrationAccessTokenEntity);
  }

  async findOneByToken(acessoControl: AcessoControl | null, token: string) {
    const target = await this.repository.findOne({
      where: { token },
      relations: {
        colaboradorAutor: {
          pessoa: true,
        },
        herdaPermissoesDeColaborador: {
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

    const data = {
      ...dto,
      token,
      colaboradorAutor: { id: acessoControl.currentColaborador.id },
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
    dto: UpdateIntegrationAccessTokenDto,
  ) {
    await acessoControl.ensureCanReachTarget(
      'integration_access_token:update',
      this.repository.createQueryBuilder('integration_access_token'),
      id,
    );

    const entity = await this.repository.preload({
      id,
      ...dto,
    });

    if (!entity) {
      throw new NotFoundException();
    }

    return this.repository.save(entity);
  }

  async remove(acessoControl: AcessoControl, id: string) {
    await acessoControl.ensureCanReachTarget(
      'integration_access_token:delete',
      this.repository.createQueryBuilder('integration_access_token'),
      id,
    );

    await this.repository.softDelete(id);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<IntegrationAccessTokenEntity>> {
    return paginate(query, this.repository, {
      ...paginateConfig,
      sortableColumns: [
        'id',
        'token',
        'descricao',
        'ativo',
        'validoAte',
        'createdAt',
        'updatedAt',
      ],
      searchableColumns: ['token', 'descricao'],
      filterableColumns: {
        ativo: [FULL_COMPARE_ENUMERABLE],
        token: [FULL_COMPARE_NUMERIC],
        createdAt: true,
        updatedAt: true,
      },
      defaultSortBy: [['createdAt', 'DESC']],
      relations: ['colaboradorAutor.pessoa'],
    });
  }

  async findOne(acessoControl: AcessoControl, id: string) {
    await acessoControl.ensureCanReachTarget(
      'integration_access_token:read',
      this.repository.createQueryBuilder('integration_access_token'),
      id,
    );

    return this.repository.findOne({
      where: { id },
      relations: {
        colaboradorAutor: {
          pessoa: true,
        },
        herdaPermissoesDeColaborador: {
          pessoa: true,
        },
      },
    });
  }
}
