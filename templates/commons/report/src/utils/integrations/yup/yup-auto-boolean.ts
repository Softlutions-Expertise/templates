import * as yup from "yup";

export const yupAutoBoolean = yup
  .mixed<boolean>()
  .transform((value) => {
    if (value === "true" || value === '"true"') return true;
    if (value === "false" || value === '"false"') return false;
    return value;
  })
  .default(false);
