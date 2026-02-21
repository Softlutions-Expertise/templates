export interface ISerieFindAll {
  id: number | string;
  ambiente: { cod: number; descricao: string };
  modelo: { cod: number; descricao: string };
  serie: number;
  numero: number;
  numeracao?: number;
  padrao: boolean;
  descricao?: string;
}

export type TSerieNfeTabs = 'informacoesGerais';

export interface ISerieNfeCreateUpdate {
  id?: number | string;
  ambiente: { cod: number; descricao: string };
  modelo: { cod: number; descricao: string };
  serie: number;
  descricao?: string;
  numero: number;
  numeracao?: number;
  padrao: boolean;
}

export type ISerieNfeFinalizeForm = {
  load: boolean;
  disabled?: {
    default?: boolean;
    salvar?: boolean;
  };
  type:
  | 'default'
  | 'salvar'
};