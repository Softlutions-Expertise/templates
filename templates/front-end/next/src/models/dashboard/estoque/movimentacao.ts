import { IObjectCodDescricao } from '@/models';

export interface IMovimentacaoMercadoria {
  mercadoriaId: number;
  produtoId: number;
  mercadoriaDescricao: string;
  quantidade: number;
  saldoAnterior: number;
  saldoPosterior: number;
}

export interface IMovimentacao {
  entidade: {
    id: string;
    nome: string;
    cpfCnpj: string;
    tipoEntidade: IObjectCodDescricao;
  };
  tipoMovimentacao: IObjectCodDescricao;
  naturezaMovimentacao: IObjectCodDescricao;
  tipoDocumentoReferencia: string;
  identificadorDocumentoReferencia: string;
  quantidadeItens: number;
  dataHoraMovimento: string;
  itens: IMovimentacaoMercadoria[];
}

export interface IMovimentacaoFindAll
  extends Pick<
    IMovimentacao,
    'tipoMovimentacao' | 'naturezaMovimentacao' | 'quantidadeItens' | 'dataHoraMovimento'
  > {
  id: number;
  nome: string;
  status: string;
  documentoReferencia: string;
}

export interface IMovimentacaoFilter {
  fornecedor?: number | null;
  mercadoria?: number | null;
  dataInicio?: string;
  dataFim?: string;
  tipoMovimentacao?: number;
  statusMovimentacao?: number;
}
