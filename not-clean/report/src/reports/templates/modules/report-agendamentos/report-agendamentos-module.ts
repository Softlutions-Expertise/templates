import { BaseReportModule } from "../../../core/base-report-module";
import { jsxRenderReportHtml } from "../../../core/jsx/jsx-render";
import { ReportModuleId } from "../../tokens/report-module-id";
import { JsxReportLayoutSlotFooter } from "./../../components/jsx/layout/slots/jsx-report-layout-slot-footer";
import JsxReportAgendamentos from "./components/jsx-report-agendamentos";
import { ReportAgendamentosDataAdapter } from "./report-data/report-agendamentos-data-adapter";
import type {
  ReportAgendamentosAdapterInput,
  ReportAgendamentosAdapterOutput,
} from "./report-data/report-agendamentos-typings";

export class ReportAgendamentosModule extends BaseReportModule<
  ReportAgendamentosAdapterInput,
  ReportAgendamentosAdapterOutput
> {
  readonly id = ReportModuleId.RELATORIO_AGENDAMENTOS;

  readonly dataAdapter = new ReportAgendamentosDataAdapter();

  private async renderHtmlMain(payload: ReportAgendamentosAdapterOutput) {
    return jsxRenderReportHtml(JsxReportAgendamentos({ payload }), {
      mode: "document",
    });
  }

  private async renderHtmlFooter(payload: ReportAgendamentosAdapterOutput) {
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

  async renderHtml(input: ReportAgendamentosAdapterInput) {
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
