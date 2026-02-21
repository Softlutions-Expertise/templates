import { IObjectCodDescricao } from '@/models';

// ----------------------------------------------------------------------

interface IIdUnit {
  id: number;
  unidade: string;
}

export interface IIntegracoesPessoa {
  perfil: IObjectCodDescricao[];
  unidades: IIdUnit[];
}

export interface IIntegracoesFinanca {
  statusConta: IObjectCodDescricao[];
  tipoTransacao: IObjectCodDescricao[];
  periodoRecorrencia: IObjectCodDescricao[];
  formaPagamento: IObjectCodDescricao[];
  modoAtualizacao: IObjectCodDescricao[];
}

export interface IOffauthContext {
  perfil: IObjectCodDescricao[];
}
