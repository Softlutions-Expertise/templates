import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getPRetry } from '../helpers/p-retry';
import { Pool, PoolClient } from 'pg';

// Constantes do módulo
const DB_HOST = process.env.DB_HOST!;
const DB_PORT = +(process.env.DB_PORT ?? 5432);
const DB_DATABASE = process.env.DB_DATABASE!;
const DB_USERNAME = process.env.DB_USERNAME!;
const DB_PASSWORD = process.env.DB_PASSWORD!;

const retryOptions = {
  initialize: {
    minTimeout: 5000,
    maxTimeout: 15000,
  },
  pool: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  poolConnect: {
    retries: 10,
    minTimeout: 2000,
    maxTimeout: 15000,
  },
};

class RetryPool extends Pool {
  async connect(): Promise<PoolClient> {
    const pRetry = await getPRetry();

    return pRetry(() => super.connect(), {
      randomize: true,
      retries: retryOptions.poolConnect.retries,
      minTimeout: retryOptions.poolConnect.minTimeout,
      maxTimeout: retryOptions.poolConnect.maxTimeout,
      onFailedAttempt: (err) => {
        console.error(
          `Não conseguiu criar conexão com o banco no RetryPool: tentativa ${err.attemptNumber}, restantes ${err.retriesLeft}`,
        );
      },
    });
  }
}

const pool = new RetryPool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  user: DB_USERNAME,
  password: DB_PASSWORD,

  max: retryOptions.pool.max,
  idleTimeoutMillis: retryOptions.pool.idleTimeoutMillis,
  connectionTimeoutMillis: retryOptions.pool.connectionTimeoutMillis,
});

const typeormConfig = new DataSource({
  type: 'postgres',

  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD,

  synchronize: false,
  dropSchema: false,
  migrationsTableName: 'migrations_ms_fila_espera',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
  migrationsRun: true,

  extra: {
    pool,
  },
});

// Inicializa com retry usando p-retry
export const initializeWithRetry = async (ds: DataSource) => {
  const pRetry = await getPRetry();

  return pRetry(() => ds.initialize(), {
    forever: true,
    randomize: true,
    minTimeout: retryOptions.initialize.minTimeout,
    maxTimeout: retryOptions.initialize.maxTimeout,
    onFailedAttempt: (err) => {
      console.error(
        `Não conseguiu criar conexão com o banco no initialize: tentativa ${err.attemptNumber}, restantes ${err.retriesLeft}`,
      );
    },
  });
};

export default typeormConfig;
