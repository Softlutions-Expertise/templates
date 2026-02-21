import * as yup from "yup";
import { yupAutoBoolean } from "../../../../../utils/integrations/yup/yup-auto-boolean";
import { yupSafeValidate } from "../../../../../utils/integrations/yup/yup-safe-validate";
import {
  ReportSchemaBaseData,
  ReportSchemaBaseDataMetadata,
} from "../../../base/schema-base";
import { ReportAgendamentoType } from "./report-agendamentos-typings";

export const ReportAgendamentosInputSchema = ReportSchemaBaseData.shape({
  metadata: ReportSchemaBaseDataMetadata.shape({
    localAtendimento: yup.object({
      id: yup.string(),
      nome: yup.string(),
      ativo: yup.boolean(),
      endereco: yup.object({
        logradouro: yup.string(),
        numero: yup.number(),
        complemento: yup.string().nullable(),
        bairro: yup.string(),
        cep: yup.string(),
        cidade: yup.string(),
        estado: yup.string(),
      }),
      contato: yup.object({
        telefones: yup.array().of(
          yup.object({
            numero: yup.string(),
            tipo: yup.string(),
            contatoPreferencial: yup.string().nullable(),
          })
        ),
        emails: yup.array().of(
          yup.object({
            email: yup.string(),
          })
        ),
      }),
      secretariaMunicipal: yup.object({
        id: yup.string(),
        nomeFantasia: yup.string(),
        razaoSocial: yup.string(),
        cnpj: yup.string(),
      }),
    }),

    filters: yup
      .object({
        type: yup
          .string()
          .required()
          .oneOf(Object.values(ReportAgendamentoType)),

        startDate: yup.string().required(),
        endDate: yup.string().required(),

        endTime: yup.string(),
        startTime: yup.string(),

        startDateBirth: yup.string(),
        endDateBirth: yup.string(),

        cpfChild: yup.string(),

        // optional boolean
        anonymizeData: yupAutoBoolean.optional().nullable(),
      })
      .required(),
  }),

  data: yup.object().shape({
    data: yup
      .array()
      .of(
        yup.object().shape({
          data: yup.string().required(),
          horario: yup.string().required(),
          cpf_crianca: yup.string().required(),
          nome_crianca: yup.string().required(),
          data_nascimento_crianca: yup.string().required(),
          nome_responsavel: yup.string().required(),
          telefone_responsavel: yup.string().required(),
          local_atendimento: yup.object({
            id: yup.string(),
            nome: yup.string(),
            endereco: yup.object({
              logradouro: yup.string(),
              numero: yup.number(),
              complemento: yup.string().nullable(),
              bairro: yup.string(),
              cep: yup.string(),
              cidade: yup.string(),
              estado: yup.string(),
            }),
            contato: yup.object({
              telefones: yup.array().of(
                yup.object({
                  numero: yup.string(),
                  tipo: yup.string(),
                  contatoPreferencial: yup.string(),
                })
              ),
              emails: yup.array().of(
                yup.object({
                  email: yup.string(),
                })
              ),
            }),
            secretaria_municipal: yup.object({
              id: yup.string(),
              nome_fantasia: yup.string(),
              razao_social: yup.string(),
              cnpj: yup.string(),
            }),
          }),
        })
      )
      .required(),

    count: yup.number(),
  }),
});

export const ReportAgendamentosValidateInput = (input: unknown) => {
  return yupSafeValidate(ReportAgendamentosInputSchema, input);
};
