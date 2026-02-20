export type SafeValidationResult<Validated> =
  | {
      isValid: true;
      data: Validated;
      error: null;
    }
  | {
      isValid: false;
      data: null;
      error: unknown;
    };
