import type { InferType } from "yup";
import type { ReportReservasInputSchema } from "./input/schema";

// =================================

export type IReportReservasAdapterInput = InferType<typeof ReportReservasInputSchema>;

export type IReportReservasAdapterOutput = IReportReservasAdapterInput;

export type IReportReservasTableRow =
  IReportReservasAdapterOutput["data"]["data"][number];
