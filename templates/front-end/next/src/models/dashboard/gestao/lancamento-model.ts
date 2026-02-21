import { IObjectCodDescricao, IObjectId } from '@/models';

export interface ILancamentoCreateEdit extends IObjectId {
  dataInicial: string;
  caixa: number;
  formaPagamento: number | IObjectCodDescricao;
  subFormaPagamento?: number | IObjectCodDescricao;
  operacao: number | IObjectCodDescricao;
  valor: number;
  documentoComplementar: string;
  observacoes: string;
}

export interface ILancamentoFindAll {
  id: number;
}

export interface ILancamentoFindAllFilter {
  caixa?: string | number;
  dataInicial?: string;
  dataFinal?: string;
  operadorId?: string | number;
  consolidacao?: boolean;
}

export interface ILancamentoContext { }
