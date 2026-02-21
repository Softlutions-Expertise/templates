import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const exibicaoGeralValidationShema = yup.object().shape({
  numero: yup.string(),
  status: yup.string(),
  dataHoraEmissao: yup.string(),
  dataHoraSaidaEntrada: yup.string(),
});

export const emitenteValidationShema = yup.object().shape({
  emitenteNome: yup.string(),
  emitenteCpfCnpj: yup.string().cpfOrCnpj(),
  emitenteTelefone: yup.string(),
  emitenteInscricaoEstadual: yup.string().nullable(),
  emitenteEnderecoCep: yup.string().nullable(),
  emitenteEnderecoEstado: yup.mixed().nullable(),
  emitenteEnderecoCidadeIbge: yup.mixed().nullable(),
  emitenteEnderecoCidade: yup.string(),
  emitenteEnderecoLogradouro: yup.string(),
  emitenteEnderecoBairro: yup.string(),
  emitenteEnderecoNumero: yup.string(),
  emitenteEnderecoComplemento: yup.string(),
  emitenteCodigoPais: yup.string(),
  emitenteNomePais: yup.string(),
});

export const destinatarioValidationShema = yup.object().shape({
  destinatarioNome: yup.string(),
  destinatarioCpfCnpj: yup.string().cpfOrCnpj(),
  destinatarioTelefone: yup.string(),
  destinatarioEmail: yup.string().email('E-mail inválido'),
  destinatarioInscricaoEstadual: yup.string(),
  presencaComprador: yup.mixed().nullable(),
  indicadorIeDestinatario: yup.mixed().nullable(),
  consumidorFinal: yup.boolean(),
  destinatarioEnderecoCep: yup.string(),
  destinatarioEnderecoEstado: yup.mixed().nullable(),
  destinatarioEnderecoCidadeIbge: yup.mixed().nullable(),
  destinatarioEnderecoCidade: yup.string(),
  destinatarioEnderecoLogradouro: yup.string(),
  destinatarioEnderecoBairro: yup.string(),
  destinatarioEnderecoNumero: yup.string(),
  destinatarioEnderecoComplemento: yup.string(),
});

export const processoValidationShema = yup.object().shape({
  naturezaOperacao: yup.mixed().nullable(),
  tipoMovimento: yup.mixed().nullable(),
  modeloDocumentoFiscal: yup.mixed().nullable(),
  formatoDanfe: yup.mixed().nullable(),
  tipoEmissao: yup.mixed().nullable(),
  identificadorDestino: yup.number().optional(),
  finalidadeNfe: yup.mixed().nullable(),
  chaveAcessoReferenciada: yup.string(),
  valorTotalBaseCalculoIcms: yup.mixed().nullable(),
  valorTotalIcms: yup.mixed().nullable(),
  valorTotalMercadorias: yup.mixed().nullable(),
  valorTotalFrete: yup.mixed().nullable(),
  valorTotalSeguro: yup.mixed().nullable(),
  valorTotalOutrasDespesas: yup.mixed().nullable(),
  valorTotalDesconto: yup.mixed().nullable(),
  valorTotalNota: yup.mixed().nullable(),
  linha1: yup.string(),
});

export const mercadoriasValidationShema = yup.object().shape({
  itens: yup.mixed().nullable(),
});

export const logisticaValidationShema = yup.object().shape({
  modalidadeFrete: yup.mixed().nullable(),
  transportadorNome: yup.string(),
  transportadorCpfCnpj: yup.string(),
  transportadorEnderecoCompleto: yup.string(),
  transportadorEstado: yup.mixed().nullable(),
  transportadorCidadeIbge: yup.mixed().nullable(),
  transportadorCidade: yup.string(),
  transportadorInscricaoEstadual: yup.string(),
  volumeQuantidade: yup.mixed().nullable(),
  volumeEspecie: yup.string(),
  volumeMarca: yup.string(),
  volumeNumero: yup.string(),
  volumePesoBruto: yup.mixed().nullable(),
  volumePesoLiquido: yup.mixed().nullable(),
  entregaMesmoEnderecoDestinatario: yup.boolean(),
  entregaEnderecoCep: yup.string(),
  entregaEnderecoEstado: yup.mixed().nullable(),
  entregaEnderecoCidadeIbge: yup.mixed().nullable(),
  entregaEnderecoCidade: yup.string(),
  entregaEnderecoLogradouro: yup.string(),
  entregaEnderecoBairro: yup.string(),
  entregaEnderecoNumero: yup.string(),
  entregaEnderecoComplemento: yup.string(),
  entregaNome: yup.string(),
  entregaCpfCnpj: yup.string(),
  entregaEmail: yup.string(),
  entregaTelefone: yup.string(),
  entregaInscricaoEstadual: yup.string(),
});

export const referenciasValidationShema = yup.object().shape({
  chaveAcessoReferenciada: yup.array().nullable(),
});

export const pagamentosValidationShema = yup.object().shape({
  pagamentos: yup.array().nullable(),
});

export const protocoloValidationShema = yup.object().shape({
  codigo: yup.string(),
  protocolo: yup.string(),
  protocoloDataHora: yup.string(),
  chaveAcesso: yup.string(),
  chaveAcessoAdicional: yup.string(),
  contingencia: yup.string(),
  justificativaContingencia: yup.string(),
  envios: yup.mixed().nullable(),
});

export const notaFiscalValidationShema = yup.object().shape({
  id: yup.number().optional(),
  ...exibicaoGeralValidationShema.fields,
  ...emitenteValidationShema.fields,
  ...destinatarioValidationShema.fields,
  ...processoValidationShema.fields,
  ...mercadoriasValidationShema.fields,
  ...logisticaValidationShema.fields,
  ...referenciasValidationShema.fields,
  ...pagamentosValidationShema.fields,
  ...protocoloValidationShema.fields,
});
