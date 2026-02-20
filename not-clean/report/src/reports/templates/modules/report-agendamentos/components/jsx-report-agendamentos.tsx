import { JsxReportLayout } from "../../../components/jsx/layout/jsx-report-layout";
import { JsxReportBrandHeader } from "../../../components/jsx/report-header/jsx-report-brand-header";
import type { ReportAgendamentosAdapterOutput } from "../report-data/report-agendamentos-typings";
import { JsxReportAgendamentosFilters } from "./jsx-report-agendamentos-filters";
import { JsxReportAgendamentosTable } from "./jsx-report-agendamentos-table";
import { JsxReportAgendamentosTitle } from "./jsx-report-agendamentos-title";
import { JsxReportAgendamentosToggles } from "./jsx-report-agendamentos-toggles";

export type IJsxReportAgendamentosProps = {
  payload: ReportAgendamentosAdapterOutput;
};

const JsxReportAgendamentos = (props: IJsxReportAgendamentosProps) => {
  const { payload } = props;

  return (
    <JsxReportLayout title="Relatório de Agendamentos">
      <JsxReportBrandHeader />

      <section>
        <JsxReportAgendamentosTitle type={payload.metadata.filters.type} />

        <JsxReportAgendamentosFilters payload={payload} />
        <JsxReportAgendamentosToggles payload={payload} />

        <main>
          <JsxReportAgendamentosTable payload={payload} />
        </main>
      </section>
    </JsxReportLayout>
  );
};

export default JsxReportAgendamentos;
