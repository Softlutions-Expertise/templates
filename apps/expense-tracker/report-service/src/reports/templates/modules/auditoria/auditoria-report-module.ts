import { BaseReportModule, RenderOutput } from "../../../core/base-report-module";
import { jsxRenderReportHtmlDocument } from "../../../core/jsx";
import { JsxReportAuditoria } from "./jsx-report-auditoria";
import { AuditoriaReportInput } from "./auditoria-report.types";

// ----------------------------------------------------------------------

export const REPORT_AUDITORIA_MODULE_ID = "auditoria";

// ----------------------------------------------------------------------

export class AuditoriaReportModule extends BaseReportModule<AuditoriaReportInput> {
  readonly id = REPORT_AUDITORIA_MODULE_ID;

  async renderHtml(input: AuditoriaReportInput): Promise<RenderOutput> {
    const element = JsxReportAuditoria({ payload: input });
    const html = jsxRenderReportHtmlDocument(element);

    return {
      main: html,
    };
  }
}
