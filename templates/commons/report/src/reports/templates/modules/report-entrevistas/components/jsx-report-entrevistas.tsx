import { JsxReportSectionSubTitle } from "@/reports/templates/components/jsx/section/jsx-report-section-sub-title";
import { JsxReportLayout } from "../../../components/jsx/layout/jsx-report-layout";
import { JsxReportBrandHeader } from "../../../components/jsx/report-header/jsx-report-brand-header";
import type { ReportEntrevistasAdapterOutput } from "../report-data/report-entrevistas-typings";
import { JsxReportEntrevistasFilters } from "./jsx-report-entrevistas-filters";
import { JsxReportEntrevistasTable } from "./jsx-report-entrevistas-table";
import { JsxReportEntrevistasTitle } from "./jsx-report-entrevistas-title";
import { JsxReportEntrevistasToggles } from "./jsx-report-entrevistas-toggles";

export type IJsxReportEntrevistasProps = {
  payload: ReportEntrevistasAdapterOutput;
};

const JsxReportEntrevistas = (props: IJsxReportEntrevistasProps) => {
  const { payload } = props;

  return (
    <JsxReportLayout $orientation="landscape" title="Relatório de Entrevistas">
      <JsxReportBrandHeader />

      <section>
        <JsxReportEntrevistasTitle />

        <JsxReportSectionSubTitle title="filtros" />

        <JsxReportEntrevistasFilters payload={payload} />

        <JsxReportSectionSubTitle title="legendas" />

        <JsxReportEntrevistasToggles payload={payload} />

        <main>
          <JsxReportEntrevistasTable payload={payload} />
        </main>
      </section>
    </JsxReportLayout>
  );
};

export default JsxReportEntrevistas;
