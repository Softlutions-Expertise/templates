import type { InferType } from "yup";
import type { ReportEntrevistasInputSchema } from "./report-entrevistas-input-schema";

export type ReportEntrevistasAdapterInput = InferType<
  typeof ReportEntrevistasInputSchema
>;

export type ReportEntrevistasAdapterOutput = ReportEntrevistasAdapterInput;

export type IReportEntrevitasTableRow =
  ReportEntrevistasAdapterOutput["data"]["data"][number]["secretarias"][number]["entrevistas"][number];
