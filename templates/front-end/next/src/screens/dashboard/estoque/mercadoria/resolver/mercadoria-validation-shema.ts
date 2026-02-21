import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const informacoesGeraisValidationShema = yup.object().shape({
  ativo: yup.boolean(),
  venderWeb: yup.boolean(),
  venderPdv: yup.boolean(),
  venderAutoatendimento: yup.boolean(),
  id: yup.mixed(),
  descricao: yup.string(),
  codigoBarras: yup.string(),
  mercadoriaOperacao: yup.string(),
  unidadeMedida: yup.string().required('Unidade de Medida'),
  informacaoAdicional: yup.string(),
  qrCode: yup.string(),
  grupoMercadoria: yup.string(),
  valorVenda: yup.number().required('Valor de Venda'),
  valorCusto: yup.number().required('Valor de Custo'),
  ncm: yup.string(),
  cest: yup.string(),
  saldoAtual: yup.number().optional(),
  saldoMinimoWeb: yup.number().required('Saldo Mínimo Web'),
  saldoMinimoAutoatendimento: yup.number().required('Saldo Mínimo Autoatendimento'),
  saldoMinimoPdv: yup.number().required('Saldo Mínimo PDV'),
  observacoes: yup.string(),
  regraTributaria: yup.mixed(),
  totalizador: yup.boolean(),
});

export const componenteValidationShema = yup.object().shape({
  componentes: yup.mixed().nullable(),
});


export const mercadoriaValidationShema = yup.object().shape({
  ...informacoesGeraisValidationShema.fields,
  ...componenteValidationShema.fields,
});
