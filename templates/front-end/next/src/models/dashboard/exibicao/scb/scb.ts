export interface IScbContext {
  statusProtocolo: IScbCodDescricao[];
  ambiente: IScbCodDescricao[];
  modalidadePagamento: IScbCodDescricao[];
  tipoAssento: IScbCodDescricao[];
  tipoMensagem: IScbCodDescricao[];
}

export interface IScbCodDescricao {
  cod: number;
  descricao: string;
}