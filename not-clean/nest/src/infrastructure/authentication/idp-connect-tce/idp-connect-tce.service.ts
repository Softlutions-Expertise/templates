import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import axios, { isAxiosError } from 'axios';
import { JwtPayload } from 'jsonwebtoken';
import { LRUCache } from 'lru-cache';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import { v4 } from 'uuid';
import { DatabaseContextService } from '../../database-context/database-context.service';
import { AccessTokenExpiredException } from '../../standards/AppErrors';
import {
  getJwtPayloadExpiresInMilliseconds,
  verifyAccessToken,
} from '../helpers/jwt';
import { JwksRsaClientContainer } from '../jwks-rsa-client';

export type IdentityResponseDto = {
  id: string;
  name: string;
  cpf: string;
  username: string;
  phoneNumber: string;
  email: string;
  dtBirth: string;
  createdAt: string;
  gender: number;
  unidadesGestoras: Array<any>;
  permissions: Array<any>;
  recursos: Array<any>;
};

export type ILoginDto = {
  jwtPayload: JwtPayload;
  cpf: string;
};

@Injectable()
export class IdpConnectTceService {
  #apiRequestsQueue = new PQueue({ concurrency: 5 });

  #decodedJwtProfilesCache = new LRUCache<string, JwtPayload>({
    max: 20,
    allowStale: false,
    ttlAutopurge: true,
  });

  #loginCache = new LRUCache<string, ILoginDto>({
    max: 200,
    allowStale: false,
    ttlAutopurge: true,
  });

  constructor(
    private jwksRsaClientService: JwksRsaClientContainer,
    private databaseContextService: DatabaseContextService,
  ) { }

  get externalTceIdentityCpf() {
    return this.databaseContextService.externalTceIdentityCpf;
  }

  private async getTceIdentityProfileByAccessToken(accessToken: string) {
    const authIdentity = process.env.HOST_API_AUTH_IDENTITY;

    if (!authIdentity) {
      console.warn('Forneça o process.env.HOST_API_AUTH_IDENTITY');

      throw new ServiceUnavailableException(
        'Can not connect to the identity provider service.',
      );
    }

    const options = {
      method: 'GET',
      url: authIdentity,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const queue = this.#apiRequestsQueue;

    try {
      const response = await pRetry(
        () => {
          return queue.add(() => axios.request<IdentityResponseDto>(options));
        },
        {
          retries: 10,

          randomize: true,

          minTimeout: 3000,
          maxTimeout: 150000,

          shouldRetry(error) {
            if (isAxiosError(error)) {
              if (error.response) {
                const status = error.response.status;

                if (status === 401) {
                  return false;
                }

                if (status >= 500 && status <= 599) {
                  return true;
                }
              }
            }

            return true;
          },
        },
      );

      const data = response.data;

      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          throw new AccessTokenExpiredException();
        }
      }

      console.debug(error);
      console.trace('unhandled error');

      throw new ServiceUnavailableException();
    }
  }

  /**
   *
   * @param accessToken
   * @returns decoded access token
   * @throws when access token is invalid or some error related
   */
  private async validateTceAccessTokenCore(accessToken: string) {
    const decoded = await verifyAccessToken(accessToken, {
      getPublicKeyByKid: (kid) => {
        return this.jwksRsaClientService.getSigninKeyPublicKeyByKid(kid);
      },
    });

    return decoded;
  }

  private async validateTceAccessToken(accessToken: string) {
    // cache hit
    {
      const jwtPayload = this.#decodedJwtProfilesCache.get(accessToken);

      if (jwtPayload) {
        return jwtPayload;
      }
    }

    // cache miss
    {
      const jwtPayload = await this.validateTceAccessTokenCore(accessToken);

      this.#decodedJwtProfilesCache.set(accessToken, jwtPayload, {
        ttl: Math.max(getJwtPayloadExpiresInMilliseconds(jwtPayload) - 5000, 1),
      });

      return jwtPayload;
    }
  }

  private async getUserCpfFromTceSub(sub: string) {
    const qb = this.externalTceIdentityCpf.createQueryBuilder('tce_cpf');

    qb.select(['tce_cpf']);

    qb.where('tce_cpf.sub = :sub', { sub: sub });

    const tceCpf = await qb.getOne();

    if (tceCpf) {
      return tceCpf.cpf;
    }

    return null;
  }

  private async getUserCpfFromAccessToken(accessToken: string) {
    const jwtPayload = await this.validateTceAccessToken(accessToken);

    const cpf = await this.getUserCpfFromTceSub(jwtPayload.sub);

    if (cpf) {
      return cpf;
    }

    const perfilTce = await this.getTceIdentityProfileByAccessToken(
      accessToken,
    );

    const novoTceCpf = this.externalTceIdentityCpf.create({
      id: v4(),

      sub: jwtPayload.sub,
      cpf: perfilTce.cpf,
    });

    await this.externalTceIdentityCpf.save(novoTceCpf);

    return perfilTce.cpf;
  }

  private async loginWithAccessTokenCore(
    accessToken: string,
  ): Promise<ILoginDto> {
    const jwtPayload = await this.validateTceAccessToken(accessToken);

    const cpf = await this.getUserCpfFromAccessToken(accessToken);

    return {
      jwtPayload,
      cpf,
    };
  }

  async loginWithAccessToken(accessToken: string): Promise<ILoginDto> {
    // cache hit
    {
      const login = this.#loginCache.get(accessToken);

      if (login) {
        return login;
      }
    }

    // cache miss
    {
      const login = await this.loginWithAccessTokenCore(accessToken);

      this.#loginCache.set(accessToken, login, {
        ttl: Math.max(
          getJwtPayloadExpiresInMilliseconds(login.jwtPayload) - 5000,
          1,
        ),
      });

      return login;
    }
  }
}
