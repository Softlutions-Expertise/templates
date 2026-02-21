export interface IRegraTributariaFindAll {
  id: number;
  descricao: string;
  icmsCstCsosn: string;
  pisCst: string;
  cofinsCst: string;
  codigoBeneficioFiscal: string;
}

export interface IRegraTributariaCreateUpdate {
  id?: number;
  descricao: string;
  codigoBeneficioFiscal: string;
  cfopSaida: string;
  icmsCstCsosn: string;
  pisCst: string;
  cofinsCst: string;
  ibsCbsCst: string;
  porcentagemReducaoBaseCalculoIcms: number;
  porcentagemReducaoBaseCalculoPis: number;
  porcentagemReducaoBaseCalculoCofins: number;
  porcentagemReducaoBaseCalculoIbsCbs: number;
  aliquotaIcms: number;
  aliquotaPis: number;
  aliquotaCofins: number;
  aliquotaCbs: number;
  aliquotaIbsUF: number;
  aliquotaIbsMun: number;
  codigoClassTrib: string;
  ncm: string[];
}

export interface IRegraTributariaFindOne extends IRegraTributariaCreateUpdate { }

export type IRegraTributariaFinalizeForm = {
  load: boolean;
  disabled?: {
    default?: boolean;
    salvar?: boolean;
  };
  type:
  | 'default'
  | 'salvar'
};