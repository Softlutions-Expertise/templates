import type { DataAdapter } from "../../utils/data-adapter";

export type RenderOutput = {
  main: string;

  slots?: {
    header?: string | null;
    footer?: string | null;
  };
};

export abstract class BaseReportModule<
  InputData extends Record<string, unknown> = Record<string, unknown>,
  TransformedData extends Record<string, unknown> = InputData,
> {
  abstract readonly id: string;

  abstract readonly dataAdapter?: DataAdapter<InputData, TransformedData>;

  abstract renderHtml(input: InputData): Promise<RenderOutput>;
}
