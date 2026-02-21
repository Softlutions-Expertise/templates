import { IObjectCodDescricao } from '@/models';

export interface ISalaFindAll {
  id: number;
  descricao: string;
  registroAncine: string;
  dimensoes: string;
}

export interface ISala {
  id?: number;
  descricao: string;
  registroAncine: string;
  tipoTela: number;
  resolucao4k: boolean;
  atmos: boolean;
  tamanhoX: number;
  tamanhoY: number;
  inverterY: boolean;
}

export interface ISalaContext1 {
  tipoTela: IObjectCodDescricao[];
  tipoPoltrona?: IObjectCodDescricao[];
  tipoAcessibilidade?: IObjectCodDescricao[];
  tipoBaseMapa?: IObjectCodDescricao[];
}

export interface ISalaFilter {
  descricao?: string;
  registroAncine?: string;
}

interface TipoCodDescricao {
  cod: number;
  descricao: string;
}

export interface IPoltronaDto {
  id?: number;
  descricao: string;
  posicaoX: number;
  posicaoY: number;
  dupla: boolean;
  divisoriaEsquerda: boolean;
  divisoriaDireita: boolean;
  bloqueada: boolean;
  tipoPoltrona: TipoCodDescricao;
  tipoBaseMapa: TipoCodDescricao;
  tipoAcessibilidade: TipoCodDescricao;
  status?: TipoCodDescricao;
}

export interface ISalaDesignerDto {
  id: number;
  nome: string;
  tamanhoX: number;
  tamanhoY: number;
  inverterY: boolean;
  poltronas: IPoltronaDto[];
}

export interface IPoltronaCreateUpdateDto {
  id?: number;
  sala: number;
  descricao: string;
  tipoPoltrona: number;
  tipoAcessibilidade: number;
  tipoBaseMapa: number;
  bloqueada: boolean;
  posicaoX: number;
  posicaoY: number;
  dupla: boolean;
  divisoriaEsquerda: boolean;
  divisoriaDireita: boolean;
}

export interface IPoltronaEditDialogProps {
  open: boolean;
  poltrona: IPoltronaDto | null;
  salaId: number;
  posicaoX: number;
  posicaoY: number;
  onClose: () => void;
  onSuccess: () => void;
}

export interface IPoltronaFormValues {
  descricao: string;
  posicaoX: number;
  posicaoY: number;
  tipoPoltrona: number;
  tipoAcessibilidade: number;
  tipoBaseMapa: number;
  bloqueada: boolean;
  dupla: boolean;
  divisoriaEsquerda: boolean;
  divisoriaDireita: boolean;
}
