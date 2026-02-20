import * as yup from 'yup';
import { appConfig } from '../../../config';
import { sortGrupoPreferencial } from '../../../utils';

export type IReportSchemaGenericGrupoPreferencial = yup.InferType<
  typeof ReportSchemaGenericGrupoPreferencial
>;

export const ReportSchemaGenericGrupoPreferencial = yup
  .object({
    posicao: yup.number().required(),
    subPosicao: yup.number().nullable().optional(),
    exigirComprovacao: yup.bool().required(),
    criterio: yup.string().required(),
  })
  .required();

export const InjectGrupoPreferencialCronologico = (value: any) => {
  if (Array.isArray(value)) {
    const gruposPreferenciais = [...value];

    if (
      appConfig.prefferedGroups.injectEntryDate &&
      !gruposPreferenciais.some(
        (i) =>
          i.criterio ===
          'Data de solicitação do pedido para matrícula e/ou entrada na fila de espera.'
      )
    ) {
      const maxPosicao =
        gruposPreferenciais.length > 0
          ? Math.max(...gruposPreferenciais.map((g) => g.posicao))
          : 0;

      const injected = ReportSchemaGenericGrupoPreferencial.cast({
        posicao: maxPosicao + 1,
        subPosicao: null,
        exigirComprovacao: false,
        criterio:
          'Data de solicitação do pedido para matrícula e/ou entrada na fila de espera.',
      });

      gruposPreferenciais.push(injected);
    }

    return gruposPreferenciais.sort((a, b) => {
      return sortGrupoPreferencial('asc', a, b);
    });
  }
}

export const ReportSchemaGenericGruposPreferenciais = yup
  .array()
  .of(ReportSchemaGenericGrupoPreferencial)
  .transform((value) => {
    return InjectGrupoPreferencialCronologico(value);
  });
