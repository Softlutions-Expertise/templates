import type { IAutoTableOptions } from "@/reports/templates/components/jsx/report-table/utils/typings";
import {
  fmtDateTimeISO,
  fmtMaskCpf,
  fmtPersonName,
} from "../../../../../utils";
import { JsxReportAutoTable } from "../../../components/jsx/report-table/jsx-report-auto-table";
import {
  type IReportVagasTableRow,
  ReportVagasType,
} from "../data/report-vagas-typings";
import type { IJsxReportVagasProps } from "./jsx-report-vagas";

export type Context = {
  type?: ReportVagasType;
  anonymizeData?: boolean;
};

const optionsBase: IAutoTableOptions<IReportVagasTableRow, Context> = {
  columns: [
    {
      key: "registro",
      label: "Registro",
      value: (row) => {
        return fmtDateTimeISO(row.data_hora_registro);
      },
    },
    {
      key: "ano",
      label: "Ano",
      shrink: "never",
      value: (row) => row.ano_letivo,
    },
    {
      key: "secretaria",
      label: "Secretaria",
      value: (row) => row.secretaria_municipal,
    },
    {
      key: "escola",
      label: "Unidade Escolar",
      value: (row) => row.unidade_escolar,
    },
    {
      key: "etapa",
      label: "Etapa",
      shrink: "never",
      value: (row) => row.apelido ?? row.etapa,
    },
    {
      key: "turno",
      label: "Turno",
      shrink: "never",
      value: (row) => row.turno,
    },
    {
      key: "turma",
      label: "Turma",
      value: (row) => row.turma,
    },
  ],
};

export const options: IAutoTableOptions<IReportVagasTableRow, Context> = {
  columns: [
    {
      key: "ocupacao",
      label: "Ocupação",
      isEnabled(context) {
        return context?.type === ReportVagasType.VAGAS_OCUPADAS;
      },
      value: (row) => {
        return fmtDateTimeISO(row.data_hora_ocupacao);
      },
    },
    {
      key: "crianca.nome",
      label: "Criança",
      isEnabled(context) {
        return context?.type === ReportVagasType.VAGAS_OCUPADAS;
      },
      value: (row, context) => {
        return fmtPersonName(row.crianca, context?.anonymizeData);
      },
    },
    {
      key: "crianca.cpf",
      label: "CPF",
      isEnabled(context) {
        return context?.type === ReportVagasType.VAGAS_OCUPADAS;
      },
      shrink: "never",
      value: (row, context) => {
        return fmtMaskCpf(row.cpf, context?.anonymizeData);
      },
    },

    ...optionsBase.columns,
  ],
};

type Props = Pick<IJsxReportVagasProps, "payload"> & {
  context: Context;
};

export const JsxReportVagasTable = (props: Props) => {
  const { context, payload } = props;

  return (
    <>
      <JsxReportAutoTable
        $fontSize="0.6em"
        options={options}
        context={context}
        rows={payload.data.data}
        totalCount={{ label: "Total" }}
      />
    </>
  );
};
