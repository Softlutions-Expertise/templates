import {
  ArgumentsHost,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios from 'axios';
import { Readable } from 'stream';
import { v4 } from 'uuid';
import { isDebugServiceEnabled } from './runtime/isDebugServiceEnabled';
import { DebugStore } from './store/debug-store.provider';
import { generateJsonArray } from '../helpers/generate-json-array-iterable';

@Injectable()
export class DebugService implements OnModuleInit {
  constructor(
    @Inject(DebugStore)
    private debugStore: DebugStore,
  ) {}

  onModuleInit() {
    process
      .on('unhandledRejection', (error, promise) => {
        this.logError(error).catch(() => {});
        console.error(error, 'Unhandled Rejection at Promise', promise);
      })
      .on('uncaughtException', (err) => {
        this.logError(err).catch(() => {});

        const MINUTES = 2;

        console.error(
          err,
          `Uncaught Exception thrown, shutdown in ${MINUTES} minutes`,
        );

        setTimeout(() => {
          process.exit(1);
        }, MINUTES * 60 * 1000);
      });
  }

  async checkAvailability() {
    return isDebugServiceEnabled();
  }

  async ensureAvailability() {
    const isAvailable = await this.checkAvailability();

    if (!isAvailable) {
      throw new ServiceUnavailableException();
    }
  }

  //

  private decodeLog(_key: string, log: unknown) {
    return log;
  }

  async getLog(id: string) {
    await this.ensureAvailability();

    if (this.debugStore.lru.has(id)) {
      const value = this.debugStore.lru.get(id);
      return this.decodeLog(id, value);
    }

    return null;
  }

  async *getAllLogs() {
    await this.ensureAvailability();

    for await (const [key, value] of this.debugStore.lru.entries()) {
      yield this.decodeLog(key, value);
    }
  }

  async getAllLogsArray() {
    const arr = [];

    for await (const item of this.getAllLogs()) {
      arr.push(item);
    }

    return arr.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  async streamJsonLogs(): Promise<Readable> {
    await this.ensureAvailability();
    return Readable.from(generateJsonArray(this.getAllLogs()));
  }

  async saveLog(error: any, extra?: any) {
    const isAvailable = await this.checkAvailability();

    if (!isAvailable) {
      return;
    }

    const id = v4();

    const timestamp = new Date().toISOString();

    const inclusion = await import('inclusion');
    const { serializeError } = await inclusion('serialize-error');

    this.debugStore.lru.set(id, {
      //
      id,
      timestamp,
      //
      //
      type: 'err',
      error: serializeError(error),
      ...extra,
      //
    });
  }

  async logError(error: unknown) {
    this.notifyDiscordWebhookGenericError(error);

    this.saveLog(error, {
      type: 'err',
    });
  }

  async notifyDiscordWebhookGenericError(error: any) {
    const isAvailable = await this.checkAvailability();

    if (!isAvailable) {
      return;
    }

    const app = process.env.NODE_ENV;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return;
    }

    const inclusion = await import('inclusion');
    const { serializeError } = await inclusion('serialize-error');

    const message = {
      content: `Erro capturado no ambiente ${app}`,
      username: `Bad Request Interceptor(${app})`,
      embeds: [
        {
          title: 'Detalhes do Erro',

          description: [
            `**Mensagem:** ${error?.message ?? serializeError(error)}`,
            `**Stack:** ${error.stack ?? '--'}`,
          ].join('\n'),

          color: 16711680,
        },
      ],
    };

    axios.post(webhookUrl, message).catch((webhookError) => {
      console.error('Erro ao enviar a mensagem para o Discord:', webhookError);
    });
  }

  async notifyDiscordWebhookRequestError(
    context: ExecutionContext | ArgumentsHost,
    error: any,
  ) {
    const isAvailable = await this.checkAvailability();

    if (!isAvailable) {
      return;
    }

    const app = process.env.NODE_ENV;
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return;
    }

    const contextAsExecutionContext: any = context;

    const handler = contextAsExecutionContext.getHandler?.().name;
    const className = contextAsExecutionContext.getClass?.().name;

    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const queryParams = request.query;
    const body = request.body;
    const headers = request.headers;
    const user = request.user;

    const message = {
      content: `Erro capturado no ambiente ${app}`,
      username: `Bad Request Interceptor(${app})`,
      embeds: [
        {
          title: 'Detalhes do Erro',
          description: `**Mensagem:** ${error.message}\n**Classe:** ${className}\n**Método:** ${handler}\n**Stack:** ${error.stack}`,
          color: 16711680,
          fields: [
            { name: 'Método HTTP', value: method, inline: true },
            { name: 'URL', value: url, inline: true },
            {
              name: 'Parâmetros de Consulta',
              value: JSON.stringify(queryParams),
              inline: true,
            },
            {
              name: 'Corpo da Requisição',
              value: JSON.stringify(body),
              inline: true,
            },
            {
              name: 'Headers',
              value: JSON.stringify(headers),
              inline: true,
            },
            {
              name: 'Usuário',
              value: user ? `${user.username} (ID: ${user.id})` : 'Anônimo',
              inline: true,
            },
          ],
        },
      ],
    };

    axios.post(webhookUrl, message).catch((webhookError) => {
      console.error('Erro ao enviar a mensagem para o Discord:', webhookError);
    });
  }

  async logRequestError(
    context: ExecutionContext | ArgumentsHost,
    error: unknown,
    _req: any,
    _res: any,
  ) {
    this.notifyDiscordWebhookRequestError(context, error);

    this.saveLog(error, {
      type: 'req',
    });
  }
}
