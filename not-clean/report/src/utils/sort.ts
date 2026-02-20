const invertSort = (delta: number) => {
  return -delta;
};

const sortOrder = (mode: "asc" | "desc", ascDelta: number) =>
  mode === "asc" ? ascDelta : invertSort(ascDelta);

const createSortLogic = <T>(ascSort: (a: T, b: T) => number) => {
  return (
    mode: "asc" | "desc",
    a: T | null | undefined,
    b: T | null | undefined,
  ) => {
    if (a && b) {
      return sortOrder(mode, ascSort(a, b));
    }

    if (a) {
      return -1;
    }

    return 1;
  };
};

export const sortNumeric = createSortLogic<number>((a, b) => a - b);

export const sortGrupoPreferencial = createSortLogic<{
  posicao: number;
  subPosicao?: number | null;
}>((a, b) => {
  if (a.posicao === b.posicao) {
    return sortNumeric("asc", a.subPosicao, b.subPosicao);
  }

  return sortNumeric("asc", a.posicao, b.posicao);
});

export const sortChronological = createSortLogic<number | Date | string>(
  (a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  },
);
