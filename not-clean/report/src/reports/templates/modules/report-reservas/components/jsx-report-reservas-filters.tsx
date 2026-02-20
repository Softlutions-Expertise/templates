import { fmtDateRange } from "../../../../../utils";
import { JsxReportHeaderFilters } from "../../../components/jsx/report-header/filters/jsx-report-header-filters";
import type { IJsxReportReservasProps } from "./jsx-report-reservas";

type Props = Pick<IJsxReportReservasProps, "payload">;



export const JsxReportReservasFilters = (props: Props) => {
  const { payload } = props;

  const filters = {
    secretaria: payload.metadata.secretariaMunicipal.nomeFantasia,
    ano: payload.metadata.filters.year,
    unidadeEscolar: payload.metadata.escola?.nomeFantasia,
    etapa: payload.metadata.filters.etapaId,
    turno: payload.metadata.filters.turn,
    status: payload.metadata.filters.status,
    
    //
    turma: payload.metadata.turma?.nome,
    //
    //
    dataRegistro: fmtDateRange(
      payload.metadata.filters.startDateOccupation,
      payload.metadata.filters.endDateOccupation
    ),
    dataAtualizacao: fmtDateRange(
      payload.metadata.filters.startDateReference,
      payload.metadata.filters.endDateReference
    ),
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
            label: "Status",
            value: filters.status,
          },
          {
            label: "Unidade de Ensino",
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
            label: "Turma",
            value: filters.turma,
          },
    
          {
            label: "Data de Registro",
            value: filters.dataRegistro,
          },

          {
            label: "Data de Atualização",
            value: filters.dataAtualizacao,
          },
         
        ]}
      />
    </>
  );
};
