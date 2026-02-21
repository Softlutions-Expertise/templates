import type { SafeValidationResult } from "./typings/safe-validation-result";

export abstract class DataAdapter<
  InputData extends Record<string, unknown>,
  OutputData extends Record<string, unknown> = InputData,
> {
  transform?(input: InputData): Promise<OutputData>;

  abstract validateInput(
    input: unknown,
  ): Promise<SafeValidationResult<InputData>>;
}
