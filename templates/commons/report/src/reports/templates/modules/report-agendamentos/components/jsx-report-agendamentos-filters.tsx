import {
  PLACEHOLDER_VOID,
  fmtDateRange,
  fmtMask,
  fmtTimeRange,
} from "../../../../../utils";
import { JsxReportHeaderFilters } from "../../../components/jsx/report-header/filters/jsx-report-header-filters";
import type { IJsxReportAgendamentosProps } from "./jsx-report-agendamentos";

type Props = Pick<IJsxReportAgendamentosProps, "payload">;

export const JsxReportAgendamentosFilters = (props: Props) => {
  const { payload } = props;

  const filters = {
    secretaria: payload.metadata.secretariaMunicipal.nomeFantasia,

    localAtendimento: payload.metadata.localAtendimento?.nome ?? PLACEHOLDER_VOID,

    enderecoLocal: payload.metadata.localAtendimento?.endereco
      ? [
          payload.metadata.localAtendimento.endereco.logradouro,
          payload.metadata.localAtendimento.endereco.numero ? `${payload.metadata.localAtendimento.endereco.numero}` : "",
          payload.metadata.localAtendimento.endereco.complemento,
          payload.metadata.localAtendimento.endereco.bairro,
          payload.metadata.localAtendimento.endereco.cidade,
          payload.metadata.localAtendimento.endereco.estado
        ].filter(Boolean).join(", ")
      : PLACEHOLDER_VOID,

    dataNascimento: fmtDateRange(
      payload.metadata.filters.startDate,
      payload.metadata.filters.endDate,
    ),

    horarioAgendamento: fmtTimeRange(
      payload.metadata.filters.startTime,
      payload.metadata.filters.endTime,
    ),

    periodoNascimento: fmtDateRange(
      payload.metadata.filters.startDateBirth,
      payload.metadata.filters.endDateBirth,
    ),

    cpfCrianca:
      fmtMask(payload.metadata.filters.cpfChild, "cpf") ?? PLACEHOLDER_VOID,
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
            label: "Local de Atendimento",
            value: filters.localAtendimento,
            size: "full",
          },
          {
            label: "Endereço do Local",
            value: filters.enderecoLocal,
            size: "full",
          },
          {
            label: "Data de Agendamento",
            value: filters.dataNascimento,
          },
          {
            label: "Horário de Agendamento",
            value: filters.horarioAgendamento,
          },
          {
            label: "Período de nascimento da criança",
            value: filters.periodoNascimento,
          },
          {
            label: "CPF da Criança",
            value: filters.cpfCrianca,
          },
        ]}
      />
    </>
  );
};
