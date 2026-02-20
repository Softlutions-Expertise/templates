import * as yup from "yup";

export const SchemaGenericMetadataEscola = yup.object({
  id: yup.string(),
  nomeFantasia: yup.string(),
  razaoSocial: yup.string(),
  cnpj: yup.string(),
});
