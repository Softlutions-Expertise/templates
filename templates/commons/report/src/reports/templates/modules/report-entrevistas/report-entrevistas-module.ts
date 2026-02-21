import { BaseReportModule } from "../../../core/base-report-module";
import { jsxRenderReportHtml } from "../../../core/jsx/jsx-render";
import { JsxReportLayoutSlotFooter } from "../../components/jsx/layout/slots/jsx-report-layout-slot-footer";
import { ReportModuleId } from "../../tokens/report-module-id";
import JsxReportEntrevistas from "./components/jsx-report-entrevistas";
import { ReportEntrevistasDataAdapter } from "./report-data/report-entrevistas-data-adapter";
import type {
  ReportEntrevistasAdapterInput,
  ReportEntrevistasAdapterOutput,
} from "./report-data/report-entrevistas-typings";

export class ReportEntrevistasModule extends BaseReportModule<
  ReportEntrevistasAdapterInput,
  ReportEntrevistasAdapterOutput
> {
  readonly id = ReportModuleId.RELATORIO_ENTREVISTAS;

  readonly dataAdapter = new ReportEntrevistasDataAdapter();

  private async renderHtmlMain(payload: ReportEntrevistasAdapterOutput) {
    return jsxRenderReportHtml(JsxReportEntrevistas({ payload }), {
      mode: "document",
    });
  }

  private async renderHtmlFooter(payload: ReportEntrevistasAdapterOutput) {
    return jsxRenderReportHtml(
      JsxReportLayoutSlotFooter({
        userName: payload.metadata.usuario.nome,
        emissionDate: payload.metadata.dateTime,
      }),
      {
        mode: "fragment",
      }
    );
  }

  async renderHtml(input: ReportEntrevistasAdapterInput) {
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
