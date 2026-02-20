import { JsxReportLayout } from "../../../components/jsx/layout/jsx-report-layout";
import { JsxReportBrandHeader } from "../../../components/jsx/report-header/jsx-report-brand-header";
import type { IReportVagasAdapterOutput } from "../data/report-vagas-typings";
import { JsxReportVagasFilters } from "./jsx-report-vagas-filters";
import { type Context, JsxReportVagasTable } from "./jsx-report-vagas-table";
import { JsxReportVagasTitle } from "./jsx-report-vagas-title";
import { JsxReportVagasToggles } from "./jsx-report-vagas-toggles";

export type IJsxReportVagasProps = {
  payload: IReportVagasAdapterOutput;
};

const JsxReportVagas = (props: IJsxReportVagasProps) => {
  const { payload } = props;

  const context: Context = {
    type: payload.metadata.filters.type,
    anonymizeData: payload.metadata.filters.anonymizeData,
  };

  return (
    <JsxReportLayout title="Relatório de Vagas">
      <JsxReportBrandHeader />

      <section>
        <JsxReportVagasTitle type={payload.metadata.filters.type} />
        <JsxReportVagasFilters payload={payload} />

        <JsxReportVagasToggles payload={payload} />

        <main>
          <JsxReportVagasTable context={context} payload={payload} />
        </main>
      </section>
    </JsxReportLayout>
  );
};

export default JsxReportVagas;
