import Mutex from "p-mutex";
import { backgroundTasksManager } from "./queues/background-tasks-queue.service";

const EmptyCache = Symbol();
type EmptyCache = typeof EmptyCache;

export const withJitCache = <T = any>(
  resolver: () => T | Promise<T>,
  enableAheadOfTime = true,
) => {
  const mutex = new Mutex();

  let cache: EmptyCache | T = EmptyCache;

  const resolve = async () => {
    return mutex.withLock(async () => {
      if (cache === EmptyCache) {
        cache = await resolver();
      }

      return cache;
    });
  };

  if (enableAheadOfTime) {
    backgroundTasksManager.enqueue(() => resolve());
  }

  return resolve;
};
