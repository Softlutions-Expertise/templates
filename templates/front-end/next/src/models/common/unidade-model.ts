import { IObjectId } from '@/models';

// ----------------------------------------------------------------------
export interface IUnidadeIdentificacao {
  nome: string;
  ativa: boolean | any;
  inscricaoEstadual: string;
  inscricaoMunicipal: string | any;
  cnpj: string;

  razaoSocial: string;
  nomeFantasia: string;
  url: string | any;
}

export interface IUnidadeEndereco {
  cidadeIbge: number | any;
  estadoIbge: string;
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoBairro: string;
  enderecoCep: string;
  enderecoComplemento: string | any;
}

export interface IUnidadeContatoRedesSociais {
  telefoneComercial: string;
  telefoneCelular: string;
  email: string;
  facebook: string | any;
  instagram: string | any;
  twitter: string | any;
}

export interface IUnidadeCreateEdit
  extends IObjectId,
  IUnidadeIdentificacao,
  IUnidadeEndereco,
  IUnidadeContatoRedesSociais { }

export interface IUnidadeItem
  extends Pick<IUnidadeCreateEdit, 'id' | 'nome' | 'url' | 'cnpj'> {
  cidade: string;
  ativa: boolean;
}
