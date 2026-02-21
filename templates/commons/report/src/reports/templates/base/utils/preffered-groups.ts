import type { IReportSchemaGenericGrupoPreferencial } from "../schema-generic-grupos-preferenciais";

export const fmtDisplayPriorityOrder = (
  prefferedGroups: IReportSchemaGenericGrupoPreferencial[],
  preffered: { posicao: number; subPosicao?: number | null | undefined }
) => {
  const index = prefferedGroups.findIndex((i) => {
    if (i.posicao !== preffered.posicao) return false;

    const sameSubPosition =
      (!preffered.subPosicao && !i.subPosicao) ||
      (!!preffered.subPosicao &&
        !!i.subPosicao &&
        preffered.subPosicao === i.subPosicao);

    return sameSubPosition;
  });

  return `${index + 1}ª`;
};
