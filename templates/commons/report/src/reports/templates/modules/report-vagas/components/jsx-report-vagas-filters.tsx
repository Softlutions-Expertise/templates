import { has } from "lodash-es";
import { fmtDateRange } from "../../../../../utils";
import { JsxReportHeaderFilters } from "../../../components/jsx/report-header/filters/jsx-report-header-filters";
import { ReportVagasType } from "../data/report-vagas-typings";
import type { IJsxReportVagasProps } from "./jsx-report-vagas";

type Props = Pick<IJsxReportVagasProps, "payload">;

const getTypeFromCode = (code: string) => {
  const codeMappings = {
    [ReportVagasType.VAGAS_OCUPADAS]: "Vagas Ocupadas",
    [ReportVagasType.VAGAS_LIVRES]: "Vagas Livres",
  };

  if (has(codeMappings, code)) {
    return codeMappings[code];
  }

  return code;
};

export const JsxReportVagasFilters = (props: Props) => {
  const { payload } = props;

  const filters = {
    secretaria: payload.metadata.secretariaMunicipal.nomeFantasia,
    ano: payload.metadata.filters.year,
    unidadeEscolar: payload.metadata.escola?.nomeFantasia,
    etapa: payload.metadata.filters.etapaId,
    turno: payload.metadata.filters.turn,
    //
    turma: payload.metadata.turma?.nome,
    //
    tipo: getTypeFromCode(payload.metadata.filters.type),
    //
    dataRegistro: fmtDateRange(
      payload.metadata.filters.startDateRegistration,
      payload.metadata.filters.endDateRegistration,
    ),
    dataOcupacao: fmtDateRange(
      payload.metadata.filters.startDateOccupation,
      payload.metadata.filters.endDateOccupation,
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
            label: "Tipo de Relatório",
            value: filters.tipo,
          },
          {
            label: "Data de Registro",
            value: filters.dataRegistro,
          },
          {
            label: "Data de Ocupação",
            value: filters.dataOcupacao,
          },
        ]}
      />
    </>
  );
};
