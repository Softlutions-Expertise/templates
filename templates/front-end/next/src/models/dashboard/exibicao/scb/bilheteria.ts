
export interface IBilheteriaFindAllFilter {
  dataCinematografica?: Date;
  retificadora?: boolean;
  statusProtocolo?: number;
}

export interface IBilheteriaFindAll {
  id: number;
  dataCinematografica: string;
  dataHoraEnvio: string;
  houveSessoes: boolean;
  retificadora: boolean;
  retificada: boolean;
  sala: string;
  status: {
    cod: number;
    descricao: string;
  };
  enviada: boolean;
}

export interface IBilheteria {
  id: number;
  dataHoraEnvio: string;
  versao: number;
  dataCinematografica: string;
  houveSessoes: boolean;
  retificador: boolean;
  retificada: boolean | null;
  dataHoraProtocolo: string;
  numeroProtocolo: string | null;
  statusProtocolo: number | null;
  sessoes: ISessaoBilheteria[];
  mensagens: IMensagemBilheteria[];
}

export interface ISessaoBilheteria {
  dataHoraInicio: string;
  tipoSessao: IDescricaoCod;
  obras: IObraBilheteria[];
  totalTipoAssento: ITipoAssentoBilheteria[];
}

export interface IObraBilheteria {
  numeroObra: string;
  tituloObra: string;
  tipoTelaScb: IDescricaoCod;
  tipoProjecao: IDescricaoCod;
  idiomaExibicao: IDescricaoCod;
  digital: boolean;
  legenda: boolean;
  libras: boolean;
  legendaDescritiva: boolean;
  audioDescricao: boolean;
  distribuidor: {
    cnpj: string;
    razaoSocial: string;
  };
}

export interface ITipoAssentoBilheteria {
  tipoAssento: IDescricaoCod;
  quantidadeTotalSala: number;
  totalCategoriaIngresso: ICategoriaIngressoBilheteria[];
}

export interface ICategoriaIngressoBilheteria {
  tipoIngresso: IDescricaoCod;
  espectadores: number;
  modalidades: IModalidadePagamentoBilheteria[];
}

export interface IModalidadePagamentoBilheteria {
  modalidadePagamentoScb: IDescricaoCod;
  valorArrecadado: number;
}

export interface IMensagemBilheteria {
  tipoMensagem: IDescricaoCod;
  codigoMensagem: string;
  dataHoraInicio: string;
  textoMensagem: string;
}

export interface IDescricaoCod {
  cod: number;
  descricao: string;
}
