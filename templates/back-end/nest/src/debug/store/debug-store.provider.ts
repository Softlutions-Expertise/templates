import { Provider } from '@nestjs/common';
import { LRUCache } from 'lru-cache';

export type IDebugStore = {
  lru: LRUCache<any, any>;
};

export const DebugStore = Symbol.for('fila-de-espera-api.debug-store');
export type DebugStore = IDebugStore;

export const DebugStoreProvider: Provider = {
  provide: DebugStore,

  useFactory: async () => {
    const lru = new LRUCache({
      maxSize: 100_000,

      sizeCalculation: () => {
        return 1;
      },
    });

    return {
      lru,
    };
  },
};
