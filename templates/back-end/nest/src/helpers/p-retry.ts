import PRetryModule from 'p-retry';
import { withJitCache } from './with-jit-cache';

export const getPRetry = withJitCache(async () => {
  const inclusion = await import('inclusion');
  const { default: PRetry } = await inclusion('p-retry');
  return PRetry as typeof PRetryModule;
});
