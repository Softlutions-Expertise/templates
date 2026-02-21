import * as yup from "yup";

const ReportVagasInputSchemaDataData = yup.object().shape({
  data_hora_registro: yup.string().required(),

  ano_letivo: yup.string().required(),
  secretaria_municipal: yup.string().required(),
  unidade_escolar: yup.string().required(),
  etapa: yup.string().required(),
  apelido: yup.string().optional(),
  turno: yup.string().required(),
  turma: yup.string().required(),

  data_hora_ocupacao: yup.string().optional().nullable(),
  crianca: yup.string().optional().nullable(),
  cpf: yup.string().optional().nullable(),
});

export const ReportVagasInputSchemaData = yup.object().shape({
  data: yup.array().of(ReportVagasInputSchemaDataData).required(),
  count: yup.number(),
});
