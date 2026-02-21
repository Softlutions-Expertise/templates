import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const informacoesGeraisValidationShema = yup.object().shape({
  id: yup.mixed(),
  descricao: yup.string().required('Descrição é obrigatória'),
  registroAncine: yup.string().required('Registro ANCINE é obrigatório'),
  tipoTela: yup.mixed().required('Tipo de tela é obrigatório'),
  resolucao4k: yup.boolean(),
  atmos: yup.boolean(),
  tamanhoX: yup.number().required('Tamanho X  é obrigatória'),
  tamanhoY: yup.number().required('Tamanho Y  é obrigatória'),
  inverterY: yup.boolean(),
});

export const salaValidationShema = yup.object().shape({
  ...informacoesGeraisValidationShema.fields,
});
