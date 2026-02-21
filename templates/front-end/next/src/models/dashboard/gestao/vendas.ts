import { ICaixa, ICliente, IObjectCodDescricao, IObjectId, IPagination } from '@/models';

export interface IVendasIngressosItem {
  quantidade: number;
  tipoIngresso: string;
  tipoPoltrona: string;
  valorUnitario: number;
  totalItem: number;
}

export interface IVendasProdutosItem {
  quantidade: number;
  produto: string;
  valorUnitario: number;
  totalItem: number;
}

export interface IVendasItemUnificado {
  item: number;
  tipoItem: {
    cod: number;
    descricao: string;
  };
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  taxaOperacional: number;
  taxaEcad: number;
  totalItem: number;
}

export interface IVendasPagamentoItem {
  venda: number;
  tentativa: number;
  operadora: string;
  status: string;
  subStatus: string;
  idTransacao: string;
  referencia: string;
  ipOrigem: string;
  numeroCartao: string;
  nomeCartao: string;
  comentario: string;
}

export interface IVendasVenda {
  unidade: string;
  data: string;
  hora: string;
  status: string;
  origem: string;
  localizador: string;
  valorTotal: number;
  ultimoStatusEmail: string;
  terminalImpressao: string;
  dataHoraImpressao: string;
  linkEnvioEmail?: string;
  linkConsultaPagamento?: string;
  cliente: {
    codigo: string;
    nome: string;
    bloqueadoAte: string;
  };
  sessao: {
    id: number;
    filme: string;
    data: string;
    hora: string;
    tipoProjecao: string;
    idioma: string;
    legendado: boolean;
    tipoSessao: string;
    cancelada: boolean;
  };
  observacoes: string;
}

export interface IVendasItens {
  itens: {
    valorIngressos: number;
    valorProdutos: number;
    valorTaxaComodidade: number;
    valorTotalEcad: number;
    itens: IVendasItemUnificado[];
  };
}

export interface IVendasPagamento {
  ultimoStatus: string;
  ultimoSubStatus: string;
  pagamento: IVendasPagamentoItem[];
}

export interface IVendasViewer extends IObjectId {
  localizador: string;
  caixa: string | null;
  data: string;
  hora: string;
  dataHoraImpressao: string | null;
  terminalImpressao: string | null;
  cliente: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpfCnpj: string;
  } | null;
  codigoReserva: string;
  totalDesconto: number;
  terminal: string;
  operador: string | null;
  origem: string;
  observacoes: string | null;
  valorTotal: number;
  sessao: {
    id: number;
    data: string;
    hora: string | null;
    filme: string;
    sala: string;
    tipoSessao: {
      cod: number;
      descricao: string;
    };
    tipoProjecao: {
      cod: number;
      descricao: string;
    };
    idiomaExibicao: {
      cod: number;
      descricao: string;
    };
    resolucao4k: boolean | null;
    atmos: boolean | null;
  };
  itens: {
    tipo: string;
    item: number;
    quantidade: number;
    quantidadeComDesconto: number;
    valorUnitario: number;
    valorDesconto: number;
    valorDescontoUnitario: number;
    itemCancelado: boolean;
    mercadoriaId: number;
    mercadoriaDescricao: string;
  }[];
}

export interface IVendasItem {
  id: number;
  localizador: string;
  cliente: string | null;
  dataHora: string;
  valorTotal: string;
  sessao: string;
  filme: string;
  nfce: boolean;
  status: {
    cod: number;
    descricao: string;
  };
}

export interface IVendasList extends IPagination {
  content: IVendasItem[];
}

export interface IVendasListFilter {
  cliente?: number;
  localizador?: string;
  caixa?: number;
  origem?: number;
  status?: number;
  total?: number;
  dataInicio?: string;
  dataFim?: string;
}

export interface IVendasListParam {
  unidadeId?: any;
  page: number;
  linesPerPage: number;
  orderBy?: string;
  direction?: string;
}

export type IVendasTabs = 'venda' | 'itens' | 'pagamento';

export type IVendasFinalizeForm = {
  load: boolean;
  type: 'cancelar' | 'default';
};

export interface IVendasContext {
  origem: IObjectCodDescricao[];
  status: IObjectCodDescricao[];
}

export interface IVendasFilter {
  dataInicio: string;
  dataFim: string;
  origem: string;
  localizador: string;
  total: number;
  cliente: ICliente | null;
  caixa: ICaixa | null;
  status: string;
  direction: string;
}
