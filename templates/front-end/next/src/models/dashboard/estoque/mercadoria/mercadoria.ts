import { IObjectCodDescricao, IObjectId } from '@/models';

export interface IMercadoriaInformacoesGerais extends IObjectId {
  ativo: boolean;
  venderWeb: boolean;
  venderPdv: boolean;
  venderAutoatendimento: boolean;
  totalizador: boolean;
  operacaoEstoque: boolean;
  descricao: string;
  codigoBarras: string;
  mercadoriaOperacao: IObjectCodDescricao;
  unidadeMedida: IObjectCodDescricao;
  informacaoAdicional: string;
  qrCode: string;
  grupoMercadoria: IObjectCodDescricao;
  valorVenda: number;
  valorCusto: number;
  ncm: string;
  cest: string;
  saldoAtual: number;
  saldoMinimo: number;
  saldoMinimoWeb: number;
  saldoMinimoAutoatendimento: number;
  saldoMinimoPdv: number;
  observacoes: string;
  regraTributaria: IObjectCodDescricao;
  componentes: IMercadoriaComponente[];
}

export interface ITipoComponente {
  cod: number;
  descricao: string;
}

export interface IMercadoriaComponente {
  id: number;
  quantidade: number;
  tipoComponente: number;
  ativo: boolean;
}

export interface IMercadoriaComponenteContext {
  tipoComponente: ITipoComponente[];
  tiposComponente: ITipoComponente[];
}

export interface IMercadoriaComponenteListagem {
  id: number;
  searchMercadoria: IMercadoriaInformacoesGerais;
  ativo: boolean;
  totalizador?: boolean;
  quantidade: number;
  descricao: string;
  tipoComponente: number;
  deletar?: boolean;
  valorTotalItem?: any;
  valorUnitario?: any;
}

export interface IMercadoriaUpdate extends IMercadoriaInformacoesGerais { }

export interface IMercadoriaFindAll
  extends Pick<
    IMercadoriaUpdate,
    'grupoMercadoria' | 'ativo' | 'descricao' | 'unidadeMedida' | 'saldoAtual' | 'saldoMinimo' 
  > {
  id: number;
}

export type IMercadoriaTabs = 'informacoesGerais' | 'componente';
