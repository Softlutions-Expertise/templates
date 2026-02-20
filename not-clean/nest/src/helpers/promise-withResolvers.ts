export const PromiseWithResolvers = <T>() => {
  let reject: (reason?: any) => void;
  let resolve: (value: T | PromiseLike<T>) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    resolve,
    reject,
    promise,
  };
};
