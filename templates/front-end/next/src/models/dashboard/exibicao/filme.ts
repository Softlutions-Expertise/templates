export interface IFilme {
  id: number;
  titulo: string;
  classificacaoIndicativa?: { cod: number; descricao: string };
  generoPrincipal?: { cod: number; descricao: string };
  dataEstreia?: string;
  dataPreEstreia?: string;
}

export interface IFilmeFilter {
  id?: string;
  titulo?: string;
  genero?: number;
  classificacaoIndicativa?: number;
}

export interface IUnidade {
  id: number;
  nome: string;
  url: string;
}

export interface IFilmeContext {
  genero?: { cod: number; descricao: string }[];
  classificacaoIndicativa?: { cod: number; descricao: string }[];
  unidades?: IUnidade[];
}
