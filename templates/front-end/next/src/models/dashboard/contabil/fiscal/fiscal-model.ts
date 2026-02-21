import { IObjectCodDescricao, IObjectId } from '@/models';

// ----------------------------------------------------------------------

interface IFiscalContextEmitente {
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  enderecoCep: string;
  enderecoEstado: number;
  enderecoCidadeIbge: string;
  enderecoCidade: string;
  enderecoLogradouro: string;
  enderecoBairro: string;
  enderecoNumero: string;
  enderecoComplemento: string;
  inscricaoEstadual: string;
  crt: number;
}

export interface IFiscalContext {
  emitente: IFiscalContextEmitente;
  codigoPais: number;
  nomePais: string;
  crt: IObjectCodDescricao[];
  ambienteEmissao: IObjectCodDescricao[];
  bandeiraCartao: IObjectCodDescricao[];
  finalidadeNfe: IObjectCodDescricao[];
  formaPagamento: IObjectCodDescricao[];
  formatoDanfe: IObjectCodDescricao[];
  identificadorDestino: IObjectCodDescricao[];
  identificadorIeDestinatario: IObjectCodDescricao[];
  modalidadeFrete: IObjectCodDescricao[];
  modeloDocumentoFiscal: IObjectCodDescricao[];
  modoContingencia: IObjectCodDescricao[];
  naturezaOperacao: IObjectCodDescricao[];
  pagamentoTipoIntegracao: IObjectCodDescricao[];
  presencaComprador: IObjectCodDescricao[];
  status: IObjectCodDescricao[];
  statusProcesso: IObjectCodDescricao[];
  tipoIntegracao: IObjectCodDescricao[];
  tipoEmissao: IObjectCodDescricao[];
  tipoMovimento: IObjectCodDescricao[];
  tipoPagamento: IObjectCodDescricao[];
  unidadeMedida: IObjectCodDescricao[];
  estados: IObjectCodDescricao[];
}

export interface IFiscalMercadoria extends IObjectId {
  searchMercadoria?: any;
  descricao: string;
  unidadeMedida: IObjectCodDescricao;
  ncm: string;
  codigoBarras: string;
  cest: string;
  codigoBeneficioFiscal: string;
  cfopEntrada: string;
  cfopSaida: string;
  porcentagemBaseCalculoIcms: number;
  valorBaseCalculoIcms: number;
  icmsCstCsosn: string;
  pisCst: string;
  cofinsCst: string;
  ipiCst: string;
  quantidade: number;
  valorUnitario: number;
  valorSaida: number;
  valorDesconto: number;
  valorTotal: number;
  aliquotaIcms: number;
  valorIcms: number;
  valorPis: number;
  valorCofins: number;
  valorIpiDevolvido: number;
  calculoAutomaticoIbsCbs: boolean;
  ibsCbsCst: string;
  codigoClassTrib: string;
  porcentagemBaseCalculoIbsCbs: number;
  valorBaseCalculoIbsCbs: number;
  aliquotaIbsUf: number;
  aliquotaIbsMun: number;
  aliquotaCbs: number;
  valorCbs: number;
  valorIbsUf: number;
  valorIbsMun: number;
  deletar?: boolean;
}

export interface IFiscalPagamentos extends IObjectId {
  id: number;
  formaPagamento: IObjectCodDescricao;
  tipoPagamento: IObjectCodDescricao;
  valorPagamento: number;
  dataPagamento: string;
  card?: {
    tipoIntegracao: IObjectCodDescricao;
    credenciadoraCnpj: string;
    bandeiraCartao: IObjectCodDescricao;
    pagamentoAutorizacao: string;
  };
  deletar?: boolean;
}

