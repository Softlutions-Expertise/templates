export type RenderOutput = {
  main: string;
  slots?: {
    header?: string | null;
    footer?: string | null;
  };
};

// ----------------------------------------------------------------------

export abstract class BaseReportModule<
  InputData = any,
  TransformedData = InputData,
> {
  abstract readonly id: string;

  abstract renderHtml(input: InputData): Promise<RenderOutput>;
}
