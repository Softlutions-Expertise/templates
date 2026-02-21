import { IObjectCodDescricao, IObjectId } from '@/models';

export interface ISolicitacaoAjusteItemItens {
  id: number;
  descricao: string;
  saldoCalcular: number;
  operacao: number;
  motivo: string;
  deletar: boolean;
}

export interface ISolicitacaoAjusteFindAllHistorico {
  id: number;
  agenteNome: string;
  agenteEmail: string;
  motivo: string;
  numero?: number;
  status: IObjectCodDescricao;
  deletar: boolean;
}

export interface ISolicitacaoAjusteMercadoria {
  status: IObjectCodDescricao;
  comentario: string;
  itens: ISolicitacaoAjusteItemItens[];
}

export interface ISolicitacaoAjusteHistorico {
  historico: ISolicitacaoAjusteFindAllHistorico[];
}

export interface ISolicitacaoAjusteDecidir {
  id: number;
  status: number;
  motivo: string;
}

export interface ISolicitacaoAjusteCreateUpdate
  extends IObjectId,
  ISolicitacaoAjusteMercadoria,
  ISolicitacaoAjusteHistorico {
  dataHoraRequisicao: string;
  dataHoraStatus: string;
  disabledForm: boolean;
}

export interface ISolicitacaoAjusteFindAll
  extends Pick<ISolicitacaoAjusteCreateUpdate, 'dataHoraRequisicao' | 'dataHoraStatus'> {
  id: number;
  status: IObjectCodDescricao;
  quantidadeItens: number;
}

export type ISolicitacaoAjusteTabs = 'mercadoria' | 'historico';

export type ISolicitacaoAjusteFinalizeForm = {
  load: boolean;
  disabled?: {
    default?: boolean;
    salvar?: boolean;
    enviar?: boolean;
    responder?: boolean;
  };
  type:
  | 'default'
  | 'salvar'
  | 'enviar'
  | 'responder'
  | 'cancelar'
  | 'aprovar'
  | 'rejeitar'
  | 'reverter';
};
