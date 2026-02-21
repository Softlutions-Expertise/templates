import { IObjectCodDescricao } from '@/models';

export interface IEstoqueContext {
  unidadeMedida: IObjectCodDescricao[];
  operacaoAjusteManual: IObjectCodDescricao[];
  produtoOperacao: IObjectCodDescricao[];
  situacaoTributaria: IObjectCodDescricao[];
  grupoProduto: IObjectCodDescricao[];
  tipoMovimentacao: IObjectCodDescricao[];
  statusMovimentacao: IObjectCodDescricao[];
  naturezaMovimentacao: IObjectCodDescricao[];
  tipoDocumentoReferencia: IObjectCodDescricao[];
  tipoEntidade: IObjectCodDescricao[];
  requisicaoAjusteStatus: IObjectCodDescricao[];
  regraTributaria: IObjectCodDescricao[];
}
