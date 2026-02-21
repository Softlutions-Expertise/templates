import { IObjectCodDescricao } from "@/models";

export interface IConfiguracaoEntradaFindAll {
  id: number;
  mercadoria: string;
  fornecedor: string;
  codigoBarras: string;
  codigoProduto: string;
}

export interface IConfiguracaoEntradaFindAllFilter {
  nome?: string;
  cnpj?: string;
}

export interface IConfiguracaoEntradaMercadoriaFilter {
  fornecedor?: number | string;
  mercadoria?: number | string;
  codigoBarras?: string;
  codigoProduto?: string;
}

export interface IConfiguracaoEntradaCreateUpdate {
  id?: string | number;
  fornecedor: number | { id: number };
  mercadoriaLocal: number | { id: number };
  unidadeMedidaDestino: IObjectCodDescricao
  unidadeMedidaOrigem: string;
  fatorConversao: number;
  codigoBarras: string;
  codigoProduto: string;
  descricao: string;
}

export interface IConfiguracaoEntradaSearchFts {
  id: number;
  nome: string;
}

export type IConfiguracaoEntradaTabs = 'informacoesGerais'