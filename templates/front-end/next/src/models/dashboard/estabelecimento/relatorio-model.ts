export interface IRelatorio {
  unidade: string;
  tipoPeriodo?: string;
  dataInicial: string;
  dataFinal: string;
  relatorio: {
    id?: string;
    rota?: any;
    descricao: string;
    versaoApi?: number;
    rotaV2?: string;
    bloquearData?: boolean;
  };
}

export interface IRelatorioCreate extends IRelatorio { }


export type TRelatorioTypeForm =
  | 'caixa'
  | 'exibicao'
  | 'fiscal'
  | 'estoque'
  | 'venda'
  | 'ingresso'
  | 'produto'
  | 'rendaBordero'
  | 'exemplo';
