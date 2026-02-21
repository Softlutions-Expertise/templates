import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';
import { JwksClient, SigningKey } from 'jwks-rsa';
import PQueue from 'p-queue';
import pRetry from 'p-retry';

@Injectable()
export class JwksRsaClientContainer {
  #jwksClient: JwksClient | null = null;

  #queue = new PQueue({
    concurrency: 1,
    timeout: 10_000,
    throwOnTimeout: true,
  });

  private async fetchJwks(jwksUri: string) {
    const queue = this.#queue;

    return pRetry(
      () => {
        return queue.add(async () => {
          console.debug('buscando chaves jwks', { jwksUri });
          const response = await axios.get(jwksUri);
          return response.data;
        });
      },
      {
        retries: 100,
        randomize: true,
        minTimeout: 10_000,
        maxTimeout: 60_000,
        onFailedAttempt(error) {
          console.debug({ error });
          console.trace('erro ao buscar chaves jwks');
        },
      },
    );
  }

  private async createJwksClient() {
    const jwksUri = process.env.HOST_API_AUTH_JWKS ?? null;

    if (!jwksUri) {
      console.warn('process.env.HOST_API_AUTH_JWKS não foi fornecido.');
    } else {
      return new JwksClient({
        timeout: 30 * 1000,

        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 60 * 60 * 1000,

        rateLimit: true,
        jwksRequestsPerMinute: 10,

        jwksUri: jwksUri,

        fetcher: (jwksUri) => {
          return this.fetchJwks(jwksUri);
        },
      });
    }

    return null;
  }

  private async setup() {
    if (this.#jwksClient) {
      return this.#jwksClient;
    }

    const jwksClient = await this.createJwksClient();

    if (jwksClient) {
      return jwksClient;
    }
  }

  async getJwksClient() {
    const jwksClient = await this.setup();

    if (!jwksClient) {
      throw new ServiceUnavailableException(
        '[JwksRsaClientService::error] can not create JwksClient.',
      );
    }

    return jwksClient;
  }

  async getSigninKeyByKid(kid: string | null): Promise<SigningKey | null> {
    try {
      if (kid) {
        const jwksClient = await this.getJwksClient();
        const signingKey = await jwksClient.getSigningKey(kid);
        return signingKey;
      }
    } catch (_) {
      console.debug(_);
    }

    return null;
  }

  async getSigninKeyPublicKeyByKid(kid: string | null): Promise<string | null> {
    const signingKey = await this.getSigninKeyByKid(kid);

    if (signingKey) {
      return signingKey.getPublicKey();
    }

    return null;
  }
}
