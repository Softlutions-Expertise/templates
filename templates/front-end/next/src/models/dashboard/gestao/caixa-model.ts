import { IObjectCodDescricao } from '@/models';

export interface ICaixaAbertura {
  terminal: string;
  operador: number;
  valor: number;
}

export interface ICaixaFechamento {
  id: number;
  terminal: string;
  operador: number;
  valor: number;
}

export interface ICaixaAberturaResponse {
  id: string;
  operador: string;
  dataHoraAbertura: string;
}

export interface ICaixaVerifyAbertura {
  operador: number;
  terminal: string;
}

export interface ICaixaFindAll {
  id: number;
  operador: { id: number; nome: string };
  terminal: string;
  dataHoraAbertura: string;
  dataHoraFechamento: string;
}

export interface ICaixaFindAllFilter {
  dataFinal?: string | number;
  dataInicial?: string;
  operador?: string | number;
  terminal?: string | number;
}

export interface ICaixaLancamento {
  id: number;
  venda: any;
  status: IObjectCodDescricao;
  dataHoraLancamento: string;
  formaPagamento: IObjectCodDescricao;
  subFormaPagamento: IObjectCodDescricao;
  tipoMovimento: IObjectCodDescricao;
  valor: number;
}

export interface ICaixaFindOne {
  id: number;
  operador: {
    id: number;
    nome: string;
  };
  terminal: {
    id: number;
    nomeLocal: string;
    nomeIntegradora: string;
  };
  dataHoraAbertura: string;
  dataHoraFechamento: string;
  lancamentos: ICaixaLancamento[];
  status: IObjectCodDescricao;
  valorAbertura: number;
  valorFechamento: number;
  somaEntradas: { formaPagamento: IObjectCodDescricao; valor: number }[];
  somaSaidas: { formaPagamento: IObjectCodDescricao; valor: number }[];
  totais: { formaPagamento: IObjectCodDescricao; valor: number }[];
}

export interface ICaixaContext {
  formaPagamento: IObjectCodDescricao[];
  subFormaPagamento: IObjectCodDescricao[];
}
