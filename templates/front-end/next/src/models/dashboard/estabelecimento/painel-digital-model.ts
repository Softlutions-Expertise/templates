import { IObjectId } from '@/models';

// ----------------------------------------------------------------------

export interface IPainelDigitalInformacoes {
  ativo: boolean;
  nome: string;
  ip: string;
  tipoPainel: number;
}

export interface IPainelDigitalCreateEdit extends IObjectId, IPainelDigitalInformacoes { }

export interface IPainelDigitalFindAll
  extends Pick<IPainelDigitalCreateEdit, 'id' | 'nome' | 'ip' | 'tipoPainel' | 'ativo'> { }

export type TPainelDigitalTabs = 'informacoes';
