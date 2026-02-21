import { BaseReportModule } from "../../../core/base-report-module";
import {
  jsxRenderReportHtmlDocument,
  jsxRenderReportHtmlFragment,
} from "../../../core/jsx/jsx-render";
import { JsxReportLayoutSlotFooter } from "../../components/jsx/layout/slots/jsx-report-layout-slot-footer";
import { ReportModuleId } from "../../tokens/report-module-id";
import JsxReportVagas from "./components/jsx-report-vagas";
import { ReportVagasDataAdapter } from "./data/report-vagas-data-adapter";
import type {
  IReportVagasAdapterInput,
  IReportVagasAdapterOutput,
} from "./data/report-vagas-typings";

export class ReportVagasModule extends BaseReportModule<
  IReportVagasAdapterInput,
  IReportVagasAdapterOutput
> {
  readonly id = ReportModuleId.RELATORIO_VAGAS;

  readonly dataAdapter = new ReportVagasDataAdapter();

  private async renderHtmlMain(payload: IReportVagasAdapterOutput) {
    return jsxRenderReportHtmlDocument(JsxReportVagas({ payload }));
  }

  private async renderHtmlFooter(payload: IReportVagasAdapterOutput) {
    return jsxRenderReportHtmlFragment(
      JsxReportLayoutSlotFooter({
        userName: payload.metadata.usuario.nome,
        emissionDate: payload.metadata.dateTime,
      }),
    );
  }

  async renderHtml(input: IReportVagasAdapterInput) {
    const main = await this.renderHtmlMain(input);
    const footer = await this.renderHtmlFooter(input);

    return {
      main,

      slots: {
        footer: footer,
      },
    };
  }
}
