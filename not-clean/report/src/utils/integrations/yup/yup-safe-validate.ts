import type { AnySchema, InferType } from "yup";
import type { SafeValidationResult } from "../../typings/safe-validation-result";

export const yupSafeValidate = async <Schema extends AnySchema>(
  schema: Schema,
  input: unknown,
): Promise<SafeValidationResult<InferType<Schema>>> => {
  try {
    const validateResult = await schema.validate(input, {
      strict: true,
      abortEarly: false,
      stripUnknown: true,
    });

    const castData = schema.cast(validateResult) as InferType<Schema>;

    return {
      isValid: true,
      data: castData,
      error: null,
    } as const;
  } catch (validationError) {
    return {
      isValid: false,
      data: null,
      error: validationError,
    } as const;
  }
};

export const withYupSafeValidate = <Schema extends AnySchema>(
  schema: Schema,
) => {
  return (input: unknown) => {
    return yupSafeValidate(schema, input);
  };
};
