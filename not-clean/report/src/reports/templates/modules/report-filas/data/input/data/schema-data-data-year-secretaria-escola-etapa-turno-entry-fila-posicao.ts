import * as yup from "yup";

const registroContatoSchema = yup
  .object({
    data_contato: yup.string().required(),
    ligacao_aceita: yup.string().required(),
  })
  .required();

const responsavelSchema = yup.object({
  nome: yup.string(),
});

const criancaSchema = yup
  .object({
    nome: yup.string(),
    cpf: yup.string(),
    data_nascimento: yup.string(),
  })
  .required();

const criterioSchema = yup
  .object({
    posicao: yup.number().required(),
    subPosicao: yup.number().optional().nullable(),
  })
  .required();

export type ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurnoEntryFilaPosicao =
  yup.InferType<
    typeof ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurnoEntryFilaPosicao
  >;

export const ReportFilasSchemaDataDataYearSecretariaEscolaEtapaTurnoEntryFilaPosicao =
  yup
    .object({
      data_entrevista: yup.string().required(),
      posicao_geral: yup.number().required(),
      dias_permanencia: yup.number().required(),
      crianca: criancaSchema,
      responsavel: responsavelSchema,
      responsavel2: responsavelSchema.optional().nullable(),
      registros_contato: yup.array().of(registroContatoSchema).required(),
      criterios: yup.array().of(criterioSchema),
    })
    .required();
