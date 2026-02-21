import { JsxReportLayout } from "../../../components/jsx/layout/jsx-report-layout";
import { JsxReportBrandHeader } from "../../../components/jsx/report-header/jsx-report-brand-header";
import type { IReportFilasAdapterOutput } from "../data/report-filas-typings";
import { JsxReportFilasEntries } from "./entries/jsx-report-filas-entries";
import { JsxReportFilaFilters } from "./jsx-report-fila-filters";
import { JsxReportFilaToggles } from "./jsx-report-fila-toggles";
import { JsxReportFilasSummary } from "./jsx-report-filas-summary";
import { JsxReportFilasTitle } from "./jsx-report-filas-title";

export type IJsxReportFilasProps = {
  payload: IReportFilasAdapterOutput;
};

const JsxReportFilas = (props: IJsxReportFilasProps) => {
  const { payload } = props;

  return (
    <JsxReportLayout title="Relatório das Filas de Espera">
      <JsxReportBrandHeader />

      <section>
        <JsxReportFilasTitle />

        <JsxReportFilaFilters payload={payload} />

        <JsxReportFilaToggles payload={payload} />

        <main>
          <JsxReportFilasEntries payload={payload} />

          <JsxReportFilasSummary payload={payload} />
        </main>
      </section>
    </JsxReportLayout>
  );
};

export default JsxReportFilas;
