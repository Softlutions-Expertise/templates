import { get, has } from "lodash-es";

export const getRowId = (row: any, index: number) => {
  if (has(row, "id")) {
    return get(row, "id");
  }

  return index;
};
