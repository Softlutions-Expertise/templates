import type { InferType } from "yup";
import type { ReportVagasInputSchema } from "./input/schema";

// =================================

export enum ReportVagasType {
  VAGAS_OCUPADAS = "vagas-ocupadas",
  VAGAS_LIVRES = "vagas-livres",
}

// =================================

export type IReportVagasAdapterInput = InferType<typeof ReportVagasInputSchema>;

export type IReportVagasAdapterOutput = IReportVagasAdapterInput;

export type IReportVagasTableRow =
  IReportVagasAdapterOutput["data"]["data"][number];
