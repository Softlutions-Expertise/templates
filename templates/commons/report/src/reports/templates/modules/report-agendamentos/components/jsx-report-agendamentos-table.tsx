import type { IAutoTableOptions } from "@/reports/templates/components/jsx/report-table/utils/typings";
import {
  fmtDisplayDate,
  fmtDisplayDateTimeSplitted,
  fmtMaskCpf,
  fmtMaskPhone,
  fmtPersonName,
} from "../../../../../utils";
import { JsxReportAutoTable } from "../../../components/jsx/report-table/jsx-report-auto-table";
import type { IReportAgendamentosTableRow } from "../report-data/report-agendamentos-typings";
import type { IJsxReportAgendamentosProps } from "./jsx-report-agendamentos";

type Context = {
  anonymizeData?: boolean;
};

const options: IAutoTableOptions<IReportAgendamentosTableRow, Context> = {
  columns: [
    {
      key: "dataHora",
      label: "Data e Hora Agendada",
      value: (row) => {
        return fmtDisplayDateTimeSplitted(row.data, row.horario);
      },
    },
    {
      key: "crianca.nome",
      label: "Criança",
      value: (row, context) =>
        fmtPersonName(row.nome_crianca, context?.anonymizeData),
    },
    {
      key: "crianca.cpf",
      label: "CPF",
      shrink: "never",
      value: (row, context) => {
        return fmtMaskCpf(row.cpf_crianca, context?.anonymizeData);
      },
    },
    {
      key: "crianca.dataNascimento",
      label: "Data de Nascimento",
      value: (row) => {
        return fmtDisplayDate(row.data_nascimento_crianca);
      },
    },
    {
      key: "responsavel.nome",
      label: "Responsável",
      value: (agendamento, context) =>
        fmtPersonName(agendamento.nome_responsavel, context?.anonymizeData),
    },
    {
      key: "responsavel.telefone",
      label: "Telefone",
      shrink: "never",
      value: (agendamento, context) => {
        return fmtMaskPhone(
          agendamento.telefone_responsavel,
          context?.anonymizeData
        );
      },
    },
    {
      key: "localAtendimento.nome",
      label: "Local de Atendimento",
      value: (row) => {
        return row.local_atendimento?.nome || "";
      },
    },
    {
      key: "localAtendimento.endereco",
      label: "Endereço",
      value: (row) => {
        const endereco = row.local_atendimento?.endereco;
        if (!endereco) return "";
        
        const enderecoCompleto = [
          endereco.logradouro,
          endereco.numero ? `${endereco.numero}` : "",
          endereco.complemento,
          endereco.bairro,
          endereco.cidade,
          endereco.estado
        ].filter(Boolean).join(", ");
        
        return enderecoCompleto;
      },
    },
    {
      key: "localAtendimento.contato",
      label: "Contato do Local",
      value: (row) => {
        const contato = row.local_atendimento?.contato;
        if (!contato) return "";
        
        const telefones = contato.telefones?.map(t => t.numero).filter(Boolean);
        
        return telefones?.join(" | ") || "";
      },
    },
  ],
};

type Props = Pick<IJsxReportAgendamentosProps, "payload">;

export const JsxReportAgendamentosTable = (props: Props) => {
  const { payload } = props;

  const context: Context = {
    anonymizeData: payload.metadata.filters.anonymizeData ?? false,
  };

  return (
    <>
      <JsxReportAutoTable
        options={options}
        rows={payload.data.data}
        context={context}
        totalCount={{ label: "Total de Agendamentos" }}
      />
    </>
  );
};
