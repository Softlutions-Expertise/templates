import { IObjectCodDescricao } from '@/models';

// ----------------------------------------------------------------------

export type IComprarIngressoSessaoTiposIngressoDto = 'inteira' | 'meia';

export interface IComprarIngressoSalaPoltronaDto {
  poltronaId: string | number;
  posicaoX: number;
  posicaoY: number;
  divisoriaEsquerda?: boolean;
  divisoriaDireita?: boolean;
  tipoBaseMapa: IObjectCodDescricao;
  tipoAcessibilidade?: IObjectCodDescricao;
  tipoPoltrona?: IObjectCodDescricao;
  descricao?: string;
  dupla?: boolean;
  status?: IObjectCodDescricao;
  requestId?: string;
}

export interface IComprarIngressoSalaFindOneDto {
  id: string | number;
  descricao: string;
  tamanhoX: number;
  tamanhoY: number;
  inverterY?: boolean;
  poltronas: IComprarIngressoSalaPoltronaDto[];
}

export interface IComprarIngressoSessaoDto {
  id: string | number;
  data: string;
  hora: string;
  sala: string;
  filme: string;
  promocao?: boolean;
}

export interface IComprarIngressoIngressoDto {
  quantidade: number;
  poltronas: IComprarIngressoSalaPoltronaDto[];
}

export interface IComprarIngressoDto {
  sessao?: IComprarIngressoSessaoDto;
  sala?: IComprarIngressoSalaFindOneDto;
  ingressos: {
    inteira?: IComprarIngressoIngressoDto;
    meia?: IComprarIngressoIngressoDto;
  };
}
