import * as yup from "yup";

export const ReportSchemaBaseDataMetadata = yup.object({
  secretariaMunicipal: yup.object({
    id: yup.string(),
    nomeFantasia: yup.string(),
    razaoSocial: yup.string(),
    cnpj: yup.string(),
  }),

  usuario: yup.object({
    nome: yup.string().required(),
    cpf: yup.string(),
    cargo: yup.string(),
    nivelAcesso: yup.string(),
  }),

  dateTime: yup.string().required(),

  filters: yup.mixed(),
});

export const ReportSchemaBaseData = yup.object({
  title: yup.string(),
  metadata: ReportSchemaBaseDataMetadata,
  data: yup.mixed().required(),
});
