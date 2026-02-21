import { BaseReportModule } from "../../../core/base-report-module";
import { jsxRenderReportHtml } from "../../../core/jsx/jsx-render";
import { JsxReportLayoutSlotFooter } from "../../components/jsx/layout/slots/jsx-report-layout-slot-footer";
import { ReportModuleId } from "../../tokens/report-module-id";
import JsxReportFilas from "./components/jsx-report-filas";
import { ReportFilasDataAdapter } from "./data/report-filas-data-adapter";
import type {
  IReportFilasAdapterInput,
  IReportFilasAdapterOutput,
} from "./data/report-filas-typings";

export class ReportFilasModule extends BaseReportModule<
  IReportFilasAdapterInput,
  IReportFilasAdapterOutput
> {
  readonly id = ReportModuleId.RELATORIO_FILAS;

  readonly dataAdapter = new ReportFilasDataAdapter();

  private async renderHtmlMain(payload: IReportFilasAdapterOutput) {
    return jsxRenderReportHtml(JsxReportFilas({ payload }), {
      mode: "document",
    });
  }

  private async renderHtmlFooter(payload: IReportFilasAdapterOutput) {
    return jsxRenderReportHtml(
      JsxReportLayoutSlotFooter({
        userName: payload.metadata.usuario.nome,
        emissionDate: payload.metadata.dateTime,
      }),
      {
        mode: "fragment",
      },
    );
  }

  async renderHtml(input: IReportFilasAdapterInput) {
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
