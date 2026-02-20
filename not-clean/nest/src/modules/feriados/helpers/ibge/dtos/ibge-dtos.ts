export type IUnidadeFederativaDto = {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
};

export type IMesorregiaoDto = {
  id: number;
  nome: string;
  UF: IUnidadeFederativaDto;
};

export type IMicrorregiaoDto = {
  id: number;
  nome: string;
  mesorregiao: IMesorregiaoDto;
};

export type IRegiaoIntermediariaDto = {
  id: number;
  nome: string;
  UF: IUnidadeFederativaDto;
};

export type IRegiaoImediataDto = {
  id: number;
  nome: string;
  'regiao-intermediaria': IRegiaoIntermediariaDto;
};

export type IMunicipioDto = {
  id: number;
  nome: string;
  microrregiao: IMicrorregiaoDto;
  'regiao-imediata': IRegiaoImediataDto;
};
