import {
  BadGatewayException,
  Injectable,
  OnModuleInit,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { LRUCache } from 'lru-cache';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import {
  getJwtPayloadExpiresInMilliseconds,
  verifyAccessToken,
} from '../helpers/jwt';
import { JwksRsaClientContainer } from '../jwks-rsa-client';

const TOLERANCE_IN_SECONDS = 7 * 60 * 60;
const TOLERANCE_IN_MILISECONDS = TOLERANCE_IN_SECONDS * 1000;

export type ILoginDto = {
  jwtPayload: JwtPayload;
  cpf: string;
};

@Injectable()
export class IdpConnectGovBrService implements OnModuleInit {
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

  constructor(private jwksRsaClientService: JwksRsaClientContainer) { }

  #loadOpenIdConfigurationQueue = new PQueue({ concurrency: 1 });

  #openidConfiguration: Record<string, unknown> | null = null;

  private async fetchOpenIdConfiguration() {
    const url = process.env.HOST_API_AUTH_WELL_KNOWN_OIDC;

    if (!url) {
      throw new BadGatewayException();
    }

    return pRetry(
      async () => {
        try {
          const res = await fetch(url);

          if (res.ok) {
            const json = await res.json();
            return json;
          }
        } catch (_) { }

        throw new ServiceUnavailableException();
      },
      { retries: 3 },
    );
  }

  private async loadOpenIdConfigurationCore() {
    if (!this.#openidConfiguration) {
      this.#openidConfiguration = await this.fetchOpenIdConfiguration();
    }

    return this.#openidConfiguration;
  }

  private async loadOpenIdConfiguration() {
    return this.#loadOpenIdConfigurationQueue.add(() => {
      return this.loadOpenIdConfigurationCore();
    });
  }

  private async loadOpenIdConfigurationInfinitePool() {
    await pRetry(
      async () => {
        return this.loadOpenIdConfiguration();
      },
      {
        forever: true,

        minTimeout: 1000,

        randomize: true,

        shouldRetry(error) {
          if (error instanceof BadGatewayException) {
            return false;
          }

          return true;
        },
      },
    ).catch(() => { });
  }

  async getOpenIdConfiguration() {
    return this.loadOpenIdConfiguration();
  }

  async onModuleInit() {
    this.loadOpenIdConfigurationInfinitePool();
  }

  /**
   *
   * @param accessToken
   * @returns decoded access token
   * @throws when access token is invalid or some error related
   */
  private async validateGovBrAccessTokenCore(accessToken: string) {
    try {
      const decoded = await verifyAccessToken(accessToken, {
        getPublicKeyByKid: (kid) => {
          return this.jwksRsaClientService.getSigninKeyPublicKeyByKid(kid);
        },
        verifyOptions: {
          clockTolerance: TOLERANCE_IN_SECONDS,
        },
      });

      return decoded;
    } catch (_) {
      throw new UnauthorizedException("Token de acesso inválido. O cabeçalho Authorization deve seguir a estrutura 'Bearer {token}'. 'token' deve ser um JWT válido ou um Token de Integração.");
    }
  }

  private async validateGovBrAccessToken(accessToken: string) {
    // cache hit
    {
      const jwtPayload = this.#decodedJwtProfilesCache.get(accessToken);

      if (jwtPayload) {
        return jwtPayload;
      }
    }

    // cache miss
    {
      const jwtPayload = await this.validateGovBrAccessTokenCore(accessToken);

      this.#decodedJwtProfilesCache.set(accessToken, jwtPayload, {
        ttl: Math.max(
          getJwtPayloadExpiresInMilliseconds(jwtPayload) +
          TOLERANCE_IN_MILISECONDS -
          5000,
          1,
        ),
      });

      return jwtPayload;
    }
  }

  private async getUserCpfFromGovBrSub(sub: string) {
    return sub;
  }

  private async getUserCpfFromAccessToken(accessToken: string) {
    const jwtPayload = await this.validateGovBrAccessToken(accessToken);
    const cpf = await this.getUserCpfFromGovBrSub(jwtPayload.sub);
    return cpf;
  }

  private async loginWithAccessTokenCore(
    accessToken: string,
  ): Promise<ILoginDto> {
    const jwtPayload = await this.validateGovBrAccessToken(accessToken);

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
          getJwtPayloadExpiresInMilliseconds(login.jwtPayload) +
          TOLERANCE_IN_MILISECONDS -
          5000,
          1,
        ),
      });

      return login;
    }
  }
}
