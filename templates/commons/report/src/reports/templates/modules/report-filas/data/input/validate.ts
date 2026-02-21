import { withYupSafeValidate } from "../../../../../../utils/integrations/yup/yup-safe-validate";
import { ReportFilasInputSchema } from "./schema";

export const ReportFilasInputValidate = withYupSafeValidate(
  ReportFilasInputSchema,
);
