import { IObjectCodDescricao } from '@/models';

export interface ISessaoContext {
  tipoProjecao: IObjectCodDescricao[];
  idiomaExibicao: IObjectCodDescricao[];
  tipoSessao: IObjectCodDescricao[];
  dia: IObjectCodDescricao[];
  tipoPoltrona: IObjectCodDescricao[];
  genero: IObjectCodDescricao[];
  classificacaoIndicativa: IObjectCodDescricao[];
  sala: ISalaContext[];
}

export type ISalaMenuItem = IObjectCodDescricao;
export type IFilmeMenuItem = IObjectCodDescricao;

export interface ISessaoFilter {
  sala?: number | string;
  filme?: number | string;
  dataInicial?: string;
  dataFinal?: string;
}

export interface ISessaoFindAll {
  id: number;
  sala: string;
  filme: string;
  data: string;
  hora: string; 
  horarios?: string[];
  tipoProjecao?: number | string;
}

export interface ISessaoHorario {
  id?: number;
  sala: number | string;
  salaRendas: number | string;
  hora: string;
  tipoSessao: number;
  tipoProjecao: number;
  idiomaExibicao: number;
  resolucao4k: boolean;
  atmos: boolean;
  libras: boolean;
  legendaDescritiva: boolean;
  audioDescricao: boolean;
  valoresPadrao: { [tipoPoltrona: string]: number };
  valoresPromocao?: { [tipoPoltrona: string]: number };
  habilitar?: boolean;
  deletar?: boolean;
}

export interface ISessaoCreate {
  filme: number | { cod: number; [key: string]: any };
  dataInicio: string; 
  dataFim: string; 
  horarios: ISessaoHorario[];
}

export interface ISessaoEdit {
  id?: number;
  filme: number | { cod: number; [key: string]: any };
  data: string;
  hora: string;
  sala: number | string;
  salaRendas: number | string;
  tipoSessao: number;
  tipoProjecao: number;
  idiomaExibicao: number;
  resolucao4k: boolean;
  atmos: boolean;
  libras: boolean;
  legendaDescritiva: boolean;
  audioDescricao: boolean;
  valoresPadrao?: { [tipoPoltrona: string]: number };
  valoresPromocao?: { [tipoPoltrona: string]: number };
  venderPdv?: boolean;
  venderWeb?: boolean;
  venderAtm?: boolean;
}

export interface ISalaContext {
  id: number;
  descricao: string;
  tipoPoltrona: IObjectCodDescricao[];
}

export interface IFilmeOption {
  id?: number;
  cod?: number;
  titulo?: string;
  nome?: string;
  descricao?: string;
}

export type ISessaoTabs = 'informacoesGerais'
