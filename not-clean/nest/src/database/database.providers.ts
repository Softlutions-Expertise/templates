import typeormConfig, { initializeWithRetry } from './typeorm.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return initializeWithRetry(typeormConfig);
    },
  },
];
