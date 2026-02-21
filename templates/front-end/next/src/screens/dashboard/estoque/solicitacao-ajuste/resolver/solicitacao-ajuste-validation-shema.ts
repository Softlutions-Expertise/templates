import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const mercadoriaValidationShema = yup.object().shape({
  status: yup.number().optional(),
  comentario: yup.string()
    .required('Comentário é obrigatório')
    .min(20, 'Comentário deve ter no mínimo 20 caracteres'),
  itens: yup.mixed(),
  disabledForm: yup.boolean().optional(),
});

export const historicoValidationShema = yup.object().shape({
  historico: yup.mixed(),
});

export const solicitacaoAjusteValidationShema = yup.object().shape({
  ...mercadoriaValidationShema.fields,
  ...historicoValidationShema.fields,
});
