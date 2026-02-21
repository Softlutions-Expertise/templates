import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const informacoesGeraisValidationShema = yup.object().shape({
  id: yup.string(),
  numero: yup.number().required('O número'),
  descricao: yup.string().required('A descrição'),
  padrao: yup.boolean().required('O campo padrão'),
  ambiente: yup.number().required('O ambiente'),
  modelo: yup.number().required('O modelo'),
  serie: yup.number()
    .required('A série'),
});

export const serieNfeValidationShema = yup.object().shape({
  ...informacoesGeraisValidationShema.fields,
});

