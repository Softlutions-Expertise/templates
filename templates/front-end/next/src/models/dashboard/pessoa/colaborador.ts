import { IObjectCodDescricao, IPagination } from '@/models';

// ----------------------------------------------------------------------

export interface IColaborador {
  id: number;
  nome: string;
  username: string;
  perfil: string;
  bloqueado: boolean;
  updatePassword: boolean;
}

export interface IColaboradorShow {
  id: number;
  nome: string;
  username: string;
  perfil: IObjectCodDescricao;
  bloqueado: boolean;
  updatePassword: boolean;
}

export interface IColaboradorList extends IPagination {
  content: IColaborador[];
}

export interface IColaboradorListParam {
  page: number;
  linesPerPage: number;
}

export interface IColaboradorListFilter {
  nome?: string;
  username?: string;
  perfil?: string;
}

export interface IColaboradorCreateUpdate {
  nome: string;
  username: string;
  perfil: number;
  bloqueado: boolean;
  updatePassword: boolean;
}
