import * as yup from "yup";

const ReportReservasInputSchemaDataData = yup.object().shape({
  codigo_reserva_vaga: yup.string().optional().nullable(),
  data_reserva_vaga: yup.string().optional().nullable(),
  data_referencia: yup.string().optional().nullable(),
  criancaNome: yup.string().optional().nullable(),
  criancaCpf: yup.string().optional().nullable(),
  escola: yup.string().optional().nullable(),
  etapa: yup.string().optional().nullable(),
  turno: yup.string().optional().nullable(),
  turma: yup.string().optional().nullable(),
  status: yup.string().optional().nullable(),
  criterios: yup.array().optional().nullable(),
  matricula: yup.string().optional().nullable(),
  grupo_preferencial: yup.array().optional().nullable(),
});

export const ReportReservasInputSchemaData = yup.object().shape({
  data: yup.array().of(ReportReservasInputSchemaDataData).required(),
  count: yup.number(),
});
