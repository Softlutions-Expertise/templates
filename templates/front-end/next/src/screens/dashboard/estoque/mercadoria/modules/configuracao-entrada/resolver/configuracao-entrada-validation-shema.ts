import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const informacoesGeraisValidationShema = yup.object().shape({
  id: yup.mixed(),
  fornecedor: yup.mixed().required('ConfiguracaoEntrada é obrigatório'),
  mercadoriaLocal: yup.mixed().required('Mercadoria é obrigatória'),
  unidadeMedidaDestino: yup.number().required('Unidade de medida de destino é obrigatória'),
  unidadeMedidaOrigem: yup.string().required('Unidade de medida de origem é obrigatória'),
  fatorConversao: yup.number()
    .required('Fator de conversão é obrigatório'),
  codigoBarras: yup.string()
    .required('Código de barras é obrigatório'),
  codigoProduto: yup.string()
    .required('Código do produto é obrigatório'),
  descricao: yup.string()
    .required('Descrição é obrigatória'),
});

export const fornecedorValidationShema = yup.object().shape({
  ...informacoesGeraisValidationShema.fields,
});
