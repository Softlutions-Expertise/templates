import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { JsxReportLayout } from "../../components/layout/jsx-report-layout";
import { JsxReportBrandHeader } from "../../components/report-header/jsx-report-brand-header";
import { JsxReportSectionTitle } from "../../components/section/jsx-report-section-title";
import { JsxReportHeaderFilters } from "../../components/report-header/filters/jsx-report-header-filters";
import { JsxReportAutoTable } from "../../components/report-table/jsx-report-auto-table";
import {
  AuditoriaReportInput,
  AuditoriaReportRow,
  TipoAcao,
} from "./auditoria-report.types";

// ----------------------------------------------------------------------

type Props = {
  payload: AuditoriaReportInput;
};

// ----------------------------------------------------------------------

const acaoLabels: Record<TipoAcao, string> = {
  [TipoAcao.LOGIN]: "Login",
  [TipoAcao.CREATE]: "Criação",
  [TipoAcao.UPDATE]: "Atualização",
  [TipoAcao.DELETE]: "Exclusão",
};

// ----------------------------------------------------------------------

const acaoColors: Record<TipoAcao, string> = {
  [TipoAcao.LOGIN]: "#2196f3",
  [TipoAcao.CREATE]: "#4caf50",
  [TipoAcao.UPDATE]: "#ff9800",
  [TipoAcao.DELETE]: "#f44336",
};

// ----------------------------------------------------------------------

export const JsxReportAuditoria = (props: Props) => {
  const { payload } = props;
  const { filters, rows, totalRecords, generatedAt } = payload;

  // Montar filtros para exibição
  const reportFilters = [];

  if (filters.startDate && filters.endDate) {
    reportFilters.push({
      label: "Período",
      value: `${format(filters.startDate, "dd/MM/yyyy")} a ${format(
        filters.endDate,
        "dd/MM/yyyy",
      )}`,
    });
  }

  if (filters.acao) {
    reportFilters.push({
      label: "Ação",
      value: acaoLabels[filters.acao],
    });
  }

  if (filters.entidade) {
    reportFilters.push({
      label: "Entidade",
      value: filters.entidade,
    });
  }

  return (
    <JsxReportLayout title="Relatório de Auditoria">
      <JsxReportBrandHeader
        systemName="Expense Tracker"
        organizationName="Sistema de Gestão Financeira"
      />

      <JsxReportSectionTitle
        title="Relatório de Auditoria"
        subtitle={`Gerado em ${format(generatedAt, "dd/MM/yyyy HH:mm", {
          locale: ptBR,
        })}`}
      />

      <section>
        <JsxReportHeaderFilters filters={reportFilters} />

        <main>
          <JsxReportAutoTable
            rows={rows}
            options={{
              columns: [
                {
                  key: "data",
                  label: "Data/Hora",
                  shrink: "never",
                  align: "left",
                  value: (row: AuditoriaReportRow) => row.data,
                },
                {
                  key: "usuario",
                  label: "Usuário",
                  align: "left",
                  value: (row: AuditoriaReportRow) => row.usuario,
                },
                {
                  key: "acao",
                  label: "Ação",
                  align: "center",
                  value: (row: AuditoriaReportRow) => (
                    <span
                      style={{
                        backgroundColor: acaoColors[row.acao],
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        display: "inline-block",
                      }}
                    >
                      {row.acaoLabel}
                    </span>
                  ),
                },
                {
                  key: "entidade",
                  label: "Entidade",
                  align: "left",
                  value: (row: AuditoriaReportRow) => row.entidade,
                },
                {
                  key: "descricao",
                  label: "Descrição",
                  align: "left",
                  value: (row: AuditoriaReportRow) => row.descricao || "-",
                },
                {
                  key: "ipAddress",
                  label: "IP",
                  align: "center",
                  value: (row: AuditoriaReportRow) => row.ipAddress || "-",
                },
              ],
            }}
            totalCount={{ label: "Total de Registros", quantity: totalRecords }}
          />
        </main>
      </section>

      <footer
        style={{
          marginTop: "2em",
          textAlign: "center",
          fontSize: "10px",
          color: "#999",
        }}
      >
        <p>Expense Tracker - Relatório de Auditoria</p>
      </footer>
    </JsxReportLayout>
  );
};
