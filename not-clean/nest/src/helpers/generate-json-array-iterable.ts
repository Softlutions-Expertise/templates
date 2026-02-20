import { MaybePromise } from 'p-map';

export const generateJsonArray = async function* (
  iterable: MaybePromise<AsyncIterable<any>>,
) {
  yield '[';

  let first = true;

  const awaitedIterable = await iterable;

  for await (const row of awaitedIterable) {
    if (first) {
      first = false;
    } else {
      yield ',';
    }

    yield JSON.stringify(row, null, 2);
  }

  yield ']';
};
