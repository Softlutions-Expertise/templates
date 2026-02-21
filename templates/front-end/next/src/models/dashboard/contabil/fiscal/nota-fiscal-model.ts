import { IFiscalMercadoria, IFiscalPagamentos, IObjectCodDescricao, IObjectId } from '@/models';

// ----------------------------------------------------------------------

export interface INotaFiscalExibicaoGeral {
  numero: string;
  status: IObjectCodDescricao;
  dataHoraEmissao: string;
  dataHoraSaidaEntrada: string;
}

export interface INotaFiscalEmitente {
  emitenteNome: string;
  emitenteCpfCnpj: string;
  emitenteTelefone: string;
  emitenteInscricaoEstadual: string;
  emitenteEnderecoCep: string;
  emitenteEnderecoEstado: IObjectCodDescricao;
  emitenteEnderecoCidadeIbge: number;
  emitenteEnderecoCidade: string;
  emitenteEnderecoLogradouro: string;
  emitenteEnderecoBairro: string;
  emitenteEnderecoNumero: string;
  emitenteEnderecoComplemento: string;
  emitenteNomePais: string;
  emitenteCodigoPais: string;
}

export interface INotaFiscalDestinatario {
  destinatarioNome: string;
  destinatarioCpfCnpj: string;
  destinatarioTelefone: string;
  destinatarioEmail: string;
  destinatarioInscricaoEstadual: string;
  presencaComprador: IObjectCodDescricao;
  indicadorIeDestinatario: IObjectCodDescricao;
  consumidorFinal: boolean;
  destinatarioEnderecoCep: string;
  destinatarioEnderecoEstado: IObjectCodDescricao;
  destinatarioEnderecoCidadeIbge: number;
  destinatarioEnderecoCidade: string;
  destinatarioEnderecoLogradouro: string;
  destinatarioEnderecoBairro: string;
  destinatarioEnderecoNumero: string;
  destinatarioEnderecoComplemento: string;
}

export interface INotaFiscalProcesso {
  naturezaOperacao: IObjectCodDescricao;
  tipoMovimento: IObjectCodDescricao;
  modeloDocumentoFiscal: IObjectCodDescricao;
  formatoDanfe: IObjectCodDescricao;
  tipoEmissao: IObjectCodDescricao;
  identificadorDestino: IObjectCodDescricao;
  finalidadeNfe: IObjectCodDescricao;
  crt: number;
  valorTotalBaseCalculoIcms: number;
  valorTotalIcms: number;
  valorTotalMercadorias: number;
  valorTotalFrete: number;
  valorTotalSeguro: number;
  valorTotalOutrasDespesas: number;
  valorTotalDesconto: number;
  valorTotalNota: number;
  valorTotalPis: number;
  valorTotalCofins: number;
  valorTotalIpiDevolvido: number;
  valorTotalTributos: number;
  valorTotalBaseCalculoIbsCbs: number;
  valorTotalIbsUf: number;
  valorTotalIbsMun: number;
  valorTotalCbs: number;
  linha1: string;
}

export interface INotaFiscalMercadorias {
  itens: IFiscalMercadoria[];
}

export interface INotaFiscalLogistica {
  modalidadeFrete: IObjectCodDescricao;
  transportadorNome: string;
  transportadorCpfCnpj: string;
  transportadorEnderecoCompleto: string;
  transportadorEstado: IObjectCodDescricao;
  transportadorCidadeIbge: number;
  transportadorCidade: string;
  transportadorInscricaoEstadual: string;
  volumeQuantidade: number;
  volumeEspecie: string;
  volumeMarca: string;
  volumeNumero: string;
  volumePesoBruto: number;
  volumePesoLiquido: number;
  entregaMesmoEnderecoDestinatario: boolean;
  entregaEnderecoCep: string;
  entregaEnderecoEstado: IObjectCodDescricao;
  entregaEnderecoCidadeIbge: number;
  entregaEnderecoCidade: string;
  entregaEnderecoLogradouro: string;
  entregaEnderecoBairro: string;
  entregaEnderecoNumero: string;
  entregaEnderecoComplemento: string;
  entregaNome: string;
  entregaCpfCnpj: string;
  entregaEmail: string;
  entregaTelefone: string;
  entregaInscricaoEstadual: string;
}

export interface INotaFiscalReferencias {
  chaveAcessoReferenciada: string[]
}

export interface INotaFiscalPagamentos {
  pagamentos: IFiscalPagamentos[];
}


export interface INotaFiscalProtocolo {
  codigo: string;
  protocolo: string;
  protocoloDataHora: string;
  chaveAcesso: string;
  chaveAcessoAdicional: string;
  contingencia: string;
  justificativaContingencia: string;
  envios: {
    versao: number;
    tentativa: number;
    serieNota: number;
    numeroNota: number;
    chaveAcesso: string;
    codigoStatus: string;
    status: string;
    protocolo: string;
    protocoloDataHora: string;
  }[];
}

export interface INotaFiscalCreateUpdate
  extends IObjectId,
  INotaFiscalExibicaoGeral,
  INotaFiscalEmitente,
  INotaFiscalDestinatario,
  INotaFiscalProcesso,
  INotaFiscalMercadorias,
  INotaFiscalLogistica,
  INotaFiscalReferencias,
  INotaFiscalPagamentos,
  INotaFiscalProtocolo { }

export interface INotaFiscalFindAll
  extends Pick<INotaFiscalCreateUpdate, 'tipoMovimento' | 'status'> {
  id: number;
  numero: string;
  serie: string;
  dataHoraEmissao: string;
  nome: string;
  realizadaMovimentacaoEstoque: boolean;
}

export interface INotaFiscalFindAllFilter {
  dataInicio?: string;
  dataFim?: string;
  statusProcesso?: string | number;
  tipoMovimento?: string | number;
  numero?: string;
  destinatario?: string;
}

export type TNotaFiscalTabs =
  | 'emitente'
  | 'destinatario'
  | 'processo'
  | 'mercadorias'
  | 'fatura'
  | 'logistica'
  | 'referencias'
  | 'pagamentos'
  | 'protocolo';

export type INotaFiscalFinalizeForm = {
  load: boolean;
  disabled?: {
    default?: boolean;
    salvar?: boolean;
    transmitir?: boolean;
    excluir?: boolean;
    cancelar?: boolean;
    imprimir?: boolean;
    email?: boolean;
    danfe?: boolean;
  };
  type:
  | 'default'
  | 'salvar'
  | 'transmitir'
  | 'excluir'
  | 'cancelar'
  | 'imprimir'
  | 'email'
  | 'danfe'
  | 'cartaCorrecao'
  | 'xmlAutorizado';
};

export interface INotaFiscalTransmitir {
  numero: string;
  serie: number;
  status: {
    cod: number;
    descricao: string;
  };
  motivo: string;
  dataHoraEmissao: string;
  dataHoraSaidaEntrada: string;
  envio: {
    versao: number;
    tentativa: number;
    serieNota: number;
    numeroNota: string;
    chaveAcesso: string;
    codigoStatus: string;
    status: string;
    protocolo: string;
    protocoloDataHora: string;
  };
}
