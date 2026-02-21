import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const informacoesValidationShema = yup.object().shape({
  ativo: yup.boolean(),
  nome: yup.string(),
  ip: yup.string(),
  tipoPainel: yup.number().optional(),
});

export const painelDigitalValidationShema = yup.object().shape({
  ...informacoesValidationShema.fields,
});
