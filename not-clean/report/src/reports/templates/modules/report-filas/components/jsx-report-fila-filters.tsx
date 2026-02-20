import { fmtDateRange, fmtOrdinalRange, fmtRange } from "../../../../../utils";
import { JsxReportHeaderFilters } from "../../../components/jsx/report-header/filters/jsx-report-header-filters";
import type { IJsxReportFilasProps } from "./jsx-report-filas";

type Props = Pick<IJsxReportFilasProps, "payload">;

export const JsxReportFilaFilters = (props: Props) => {
  const { payload } = props;

  const filters = {
    secretaria: payload.metadata.secretariaMunicipal.nomeFantasia,
    ano: payload.metadata.filters.year,
    unidadeEscolar: payload.metadata.escola?.nomeFantasia,
    etapa: payload.metadata.filters.etapaId,
    turno: payload.metadata.filters.turn,

    dataEntrada: fmtDateRange(
      payload.metadata.filters.startEntryDate,
      payload.metadata.filters.endEntryDate,
    ),

    diasPermanencia: fmtRange(
      payload.metadata.filters.startDayStay,
      payload.metadata.filters.endDayStay,
    ),

    posicao: fmtOrdinalRange(
      payload.metadata.filters.startPosition,
      payload.metadata.filters.endPosition,
    ),

    resultadoUltimoContato: payload.metadata.filters.lastContactResult,
  };

  return (
    <>
      <JsxReportHeaderFilters
        filters={[
          {
            label: "Secretaria Municipal",
            value: filters.secretaria,
            size: "full",
          },
          {
            label: "Ano",
            value: filters.ano,
          },
          {
            label: "Unidade Escolar",
            value: filters.unidadeEscolar,
          },
          {
            label: "Etapa",
            value: filters.etapa,
          },
          {
            label: "Turno",
            value: filters.turno,
          },
          {
            label: "Data de Entrada",
            value: filters.dataEntrada,
          },
          {
            label: "Dias de Permanência",
            value: filters.diasPermanencia,
          },
          {
            label: "Posição na Fila",
            value: filters.posicao,
          },
          {
            label: "Resultado do Último Contato",
            value: filters.resultadoUltimoContato,
          },
        ]}
      />
    </>
  );
};
