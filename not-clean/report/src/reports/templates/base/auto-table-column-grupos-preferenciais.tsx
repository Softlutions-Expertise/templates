import { appConfig } from '../../../config';
import {
  PLACEHOLDER_DASHES_LONG,
  fmtEnumerable,
  sortGrupoPreferencial,
} from '../../../utils';
import { IReportSchemaGenericGrupoPreferencial } from './schema-generic-grupos-preferenciais';
import { fmtDisplayPriorityOrder } from './utils/preffered-groups';

export const columnGruposPreferenciaisValue = (
  grupos_preferenciais:
    | IReportSchemaGenericGrupoPreferencial[]
    | null
    | undefined,

  entryCriterios:
    | {
        subPosicao?: number | null | undefined;
        posicao: number;
      }[]
    | null
    | undefined,
  enableInjectEntryDate = true
) => {
  let criterios = entryCriterios ?? [];
  let gruposPreferenciais = grupos_preferenciais ?? [];

  if (
    enableInjectEntryDate &&
    appConfig.prefferedGroups.injectEntryDate &&
    gruposPreferenciais.length > 0
  ) {
    criterios.push({
      posicao: gruposPreferenciais.length + 1,
      subPosicao: null,
    });
  }

  if (criterios.length === 0 || gruposPreferenciais.length === 0) {
    return PLACEHOLDER_DASHES_LONG;
  }

  criterios = criterios.sort((a, b) => sortGrupoPreferencial('asc', a, b));

  return (
    <>
      {fmtEnumerable(
        criterios.map((criterio) =>
          fmtDisplayPriorityOrder(gruposPreferenciais, {
            posicao: criterio.posicao,
            subPosicao: criterio.subPosicao,
          })
        )
      )}
    </>
  );
};
