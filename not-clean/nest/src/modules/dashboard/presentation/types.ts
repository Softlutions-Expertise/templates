export interface PresentationCounterAgendamentosResultDto {
  cadastrados: string;
  futuros: string;
  hoje: string;
  passados: string;
  [property: string]: any;
}

export interface PresentationCounterVagasResultDto {
  cadastradas: string;
  livres: string;
  ocupadas: string;
  [property: string]: any;
}

export interface PresentationCounterFilaDeEsperaResultDto {
  totalCriancasFila: string;
  totalEscolasComCriancasNaFila: string;
  totalPosicoesFila: string;
  totalReservaVagas: string;
  [property: string]: any;
}
