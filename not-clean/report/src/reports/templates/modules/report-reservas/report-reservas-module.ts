import { BaseReportModule } from "../../../core/base-report-module";
import {
  jsxRenderReportHtmlDocument,
  jsxRenderReportHtmlFragment,
} from "../../../core/jsx/jsx-render";
import { JsxReportLayoutSlotFooter } from "../../components/jsx/layout/slots/jsx-report-layout-slot-footer";
import { ReportModuleId } from "../../tokens/report-module-id";
import JsxReportReservas from "./components/jsx-report-reservas";
import { ReportReservasDataAdapter } from "./data/report-reservas-data-adapter";
import type {
  IReportReservasAdapterInput,
  IReportReservasAdapterOutput,
} from "./data/report-reservas-typings";

export class ReportReservasModule extends BaseReportModule<
  IReportReservasAdapterInput,
  IReportReservasAdapterOutput
> {
  readonly id = ReportModuleId.RELATORIO_RESERVAS;

  readonly dataAdapter = new ReportReservasDataAdapter();

  private async renderHtmlMain(payload: IReportReservasAdapterOutput) {
    return jsxRenderReportHtmlDocument(JsxReportReservas({ payload }));
  }

  private async renderHtmlFooter(payload: IReportReservasAdapterOutput) {
    return jsxRenderReportHtmlFragment(
      JsxReportLayoutSlotFooter({
        userName: payload.metadata.usuario.nome,
        emissionDate: payload.metadata.dateTime,
      }),
    );
  }

  async renderHtml(input: IReportReservasAdapterInput) {
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
