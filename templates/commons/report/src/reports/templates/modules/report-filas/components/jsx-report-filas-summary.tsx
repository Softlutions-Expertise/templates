import { useMemo } from "react";
import { JsxReportAutoTable } from "../../../components/jsx/report-table/jsx-report-auto-table";
import type { IAutoTableOptions } from "../../../components/jsx/report-table/utils/typings";
import { JsxReportSectionTitle } from "../../../components/jsx/section/jsx-report-section-title";
import type { IJsxReportFilasProps } from "./jsx-report-filas";

type JsxReportFilasSummaryProps = Pick<IJsxReportFilasProps, "payload">;

type IFilaSummary = {
  ano: string | undefined;
  secretaria: string | undefined;
  escola: string | undefined;
  etapa: string | undefined;
  turno: string | undefined;
  total: number;
};

type Context = any;

const options: IAutoTableOptions<IFilaSummary, Context> = {
  columns: [
    {
      key: "year",
      label: "Ano",
      value: (row) => row.ano,
    },

    {
      key: "secretaria",
      label: "Secretaria",
      value: (row) => row.secretaria,
    },

    {
      key: "escola",
      label: "Escola",
      value: (row) => row.escola,
    },

    {
      key: "etapa",
      label: "Etapa",
      value: (row) => row.etapa,
    },

    {
      key: "turno",
      label: "Turno",
      value: (row) => row.turno,
    },

    {
      key: "total",
      label: "Total",
      value: (row) => row.total,
    },
  ],
};

export const JsxReportFilasSummary = (props: JsxReportFilasSummaryProps) => {
  const {
    payload: {
      data: { data: entries },
    },
  } = props;

  const summary = useMemo(() => {
    return entries
      .map((entry) => {
        return entry.secretarias.map((secretaria) => {
          return secretaria.escolas.map((escola) => {
            return escola.etapas.map((etapa) => {
              return etapa.turnos.map((turno): IFilaSummary => {
                return {
                  ano: entry.year,
                  secretaria: secretaria.secretaria,
                  escola: escola.escola,
                  etapa: etapa.apelido ?? etapa.etapa,
                  turno: turno.turno,
                  total: turno.entries.length,
                };
              });
            });
          });
        });
      })
      .flat(4);
  }, [entries]);

  const context = useMemo(() => ({}), []);

  const totalQuantity = summary.reduce((acc, row) => acc + row.total, 0);

  return (
    <section>
      <JsxReportSectionTitle title="Resumo" />

      <JsxReportAutoTable
        rows={summary}
        context={context}
        options={options}
        totalCount={{ label: "Total", quantity: totalQuantity }}
      />
    </section>
  );
};
