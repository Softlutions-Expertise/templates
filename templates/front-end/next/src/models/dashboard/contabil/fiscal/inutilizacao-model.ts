export interface IInutilizacaoFindAll {
  id: number;
  dataHora: string;
  serie: number;
  numeracao: string;
  justificativa: string;
  autorizado: boolean;
}

export interface IInutilizacaoParams {
  modelo?: number;
  ambiente?: number;
  serie?: number;
  numeracao?: number;
  dataInicial?: string;
  dataFinal?: string;
}

export interface IInutilizacaoSequencia {
  numeracaoInicial: number;
  numeracaoFinal: number | null;
}

export interface IInutilizacaoCreateUpdate {
  modelo: number | string;
  serie: number;
  sequencias: IInutilizacaoSequencia[];
  justificativa: string;
  id?: number;
  dataHora?: string;
  status?: string;
  ambiente?: string;
  protocolo?: string;
  detalhes?: string;
  autorizado?: boolean;
}

export interface IInutilizacaoFindById {
  id: number;
  dataHora: string;
  serie: number;
  numeracaoInicial: string;
  numeracaoFinal: string;
  status: string;
  modelo: string;
  ambiente: string;
  protocolo: string;
  detalhes: string;
  justificativa: string;
  autorizado: boolean;
}

export type TInutilizacaoTabs = 'informacoes';

export type IInutilizacaoFinalizeForm = {
  load: boolean;
  disabled?: {
    default?: boolean;
    salvar?: boolean;
  };
  type: 'default' | 'salvar';
};
