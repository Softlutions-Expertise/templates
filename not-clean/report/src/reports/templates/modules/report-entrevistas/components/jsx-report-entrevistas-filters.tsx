import { fmtDateRange, fmtRange, fmtTimeRange } from "../../../../../utils";
import { JsxReportHeaderFilters } from "../../../components/jsx/report-header/filters/jsx-report-header-filters";
import type { IJsxReportEntrevistasProps } from "./jsx-report-entrevistas";

type Props = Pick<IJsxReportEntrevistasProps, "payload">;

export const JsxReportEntrevistasFilters = (props: Props) => {
  const { payload } = props;

  const filters = {
    secretaria: payload.metadata.secretariaMunicipal.nomeFantasia,

    entrevistador: payload.metadata.filters?.entrevistador?.nome,

    dataEntrevista: fmtDateRange(
      payload.metadata.filters.startDate,
      payload.metadata.filters.endDate
    ),

    horarioEntrevista: fmtTimeRange(
      payload.metadata.filters.startTime,
      payload.metadata.filters.endTime
    ),

    tipoReponsavel: payload.metadata.filters.responsibleType,

    ano: payload.metadata.filters.year,

    unidadeEnsino: payload.metadata.escola?.nomeFantasia,
    etapa: payload.metadata.etapa?.nome,

    turno: payload.metadata.filters.turn,

    possuiIrmao: payload.metadata.filters.brotherSchool,

    membrosEndereco: fmtRange(
      payload.metadata.filters.startMembersAddress,
      payload.metadata.filters.endMembersAddress
    ),

    membrosRenda: fmtRange(
      payload.metadata.filters.startMembersFamilyIncome,
      payload.metadata.filters.endMembersFamilyIncome
    ),

    renda: fmtRange(
      payload.metadata.filters.startFamilyIncome,
      payload.metadata.filters.endFamilyIncome
    ),

    vaga: payload.metadata.filters.vacancy,

    situacao: payload.metadata.filters.situation,
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
            label: "Entrevistador",
            value: filters.entrevistador,
          },
          {
            label: "Data da Entrevista",
            value: filters.dataEntrevista,
          },
          {
            label: "Horário da Entrevista",
            value: filters.horarioEntrevista,
          },
          {
            label: "Tipo de Responsável",
            value: filters.tipoReponsavel,
          },
          {
            label: "Ano",
            value: filters.ano,
          },
          {
            label: "Unidade de Ensino",
            value: filters.unidadeEnsino,
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
            label: "Possui irmão na unidade",
            value:
              typeof filters.possuiIrmao === "boolean"
                ? filters.possuiIrmao
                  ? "Sim"
                  : "Não"
                : "Todos",
          },
          {
            label: "Membros que residem no endereço",
            value: filters.membrosEndereco,
          },
          {
            label: "Membros que trabalham no endereço",
            value: filters.membrosRenda,
          },
          {
            label: "Renda Familiar",
            value: filters.renda,
          },
          {
            label: "Vaga",
            value: filters.vaga,
          },
          {
            label: "Situação",
            value: filters.situacao,
          },
        ]}
      />
    </>
  );
};
