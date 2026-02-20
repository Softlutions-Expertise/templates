import { JsxReportSectionBlocks } from "@/reports/templates/components/jsx/section/jsx-report-section-blocks";
import styled from "styled-components";
import { JsxReportLayout } from "../../../components/jsx/layout/jsx-report-layout";
import { JsxReportBrandHeader } from "../../../components/jsx/report-header/jsx-report-brand-header";
import type { IReportReservasAdapterOutput } from "../data/report-reservas-typings";
import { JsxReportReservasFilters } from "./jsx-report-reservas-filters";
import { JsxReportFilasEntryYearSecretariaPrefferedGroups } from "./jsx-report-reservas-preferred-groups";
import {
  JsxReportReservasTable
} from "./jsx-report-reservas-table";
import { JsxReportReservasTitle } from "./jsx-report-reservas-title";
import { JsxReportReservasToggles } from "./jsx-report-reservas-toggles";

const StyledHeader = styled.header`
  text-align: center;
  margin: 1rem 0;
`;

export type IJsxReportReservasProps = {
  payload: IReportReservasAdapterOutput;
};

const JsxReportReservas = (props: IJsxReportReservasProps) => {
  const { payload } = props;

  const context: any = {
    anonymizeData: payload?.metadata?.filters?.anonymizeData,
  };

  return (
    <JsxReportLayout title="Relatório de Reservas">
      <JsxReportBrandHeader />

      <section>
        <JsxReportReservasTitle />

        <JsxReportReservasFilters payload={payload} />
        <JsxReportReservasToggles payload={payload} />

        <main>
          <JsxReportSectionBlocks
            size="medium"
            blocks={[
              {
                value: `${payload.metadata.filters.year} — ${payload.metadata.secretariaMunicipal.nomeFantasia}`,
                expand: true,
              },
            ]}
          />

          <JsxReportFilasEntryYearSecretariaPrefferedGroups payload={payload} />

          <StyledHeader>
            <p>Resevas de Vagas </p>
          </StyledHeader>

          <JsxReportReservasTable context={context} payload={payload} />
        </main>
      </section>
    </JsxReportLayout>
  );
};

export default JsxReportReservas;
