import { SelectQueryBuilder } from 'typeorm';

export const getResultOrFallback = <T>(
  promise: Promise<T>,
): Promise<T | 'N/A'> => {
  return promise.catch(() => 'N/A');
};

export const getCountOrFallback = (
  qb: SelectQueryBuilder<any>,
): Promise<string | 'N/A'> => {
  return getResultOrFallback(qb.getCount().then((total) => total.toString()));
};
