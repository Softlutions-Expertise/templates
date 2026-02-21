export interface IPainelDigitalViewerMovieSessao {
  hora: number;
  sala: string;
  tipoProjecao: string;
  idioma: string;
  esgotado: boolean;
  atmos: boolean;
  resolucao4k: boolean;
}

export interface IPainelDigitalViewerMovie {
  sessao: IPainelDigitalViewerMovieSessao[];
  urlCapa: string;
  titulo: string;
  classificacaoIndicativa: string;
  data: string;
  id: string;
}

export interface IPainelDigitalViewerPainel {
  tipoPainel: number;
  conteudo: IPainelDigitalViewerMovie[];
}
