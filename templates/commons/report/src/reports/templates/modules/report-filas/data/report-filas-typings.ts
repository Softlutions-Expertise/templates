import type { InferType } from "yup";
import type { ReportFilasInputSchema } from "./input/schema";

export type IReportFilasAdapterInput = InferType<typeof ReportFilasInputSchema>;

export type IReportFilasAdapterOutput = IReportFilasAdapterInput;
