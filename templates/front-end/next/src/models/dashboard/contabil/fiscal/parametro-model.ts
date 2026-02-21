import { IObjectCodDescricao, IObjectId } from '@/models';

// ----------------------------------------------------------------------

export interface IParametroInformacoesGerais {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  telefone: string;
  inscricaoEstadual: string;
  ambiente: IObjectCodDescricao;
  crt: IObjectCodDescricao;
  csc: string;
  token: string;
  contingencia: boolean;
  justificativaContingencia: string;
  enderecoCep: string;
  enderecoEstado: IObjectCodDescricao;
  enderecoCidadeIbge: number;
  enderecoCidade: string;
  enderecoBairro: string;
  enderecoNumero: string;
  enderecoLogradouro: string;
  enderecoComplemento: string;
  codigoPais: string;
  nomePais: string;
  responsavelTecnicoCnpj: string;
  responsavelTecnicoNomeContato: string;
  responsavelTecnicoEmail: string;
  responsavelTecnicoTelefone: string;
  contadorCnpj: string;
  timezone: string;
}

export interface IParametroCertificadoDigital {
  certificadoDigital: File | string | null;
  senhaCertificado: string;
  validadeCertificado: string;
}

export interface IParametroUpdate
  extends IObjectId,
  IParametroInformacoesGerais,
  IParametroCertificadoDigital { }

export type TParametroTabs = 'informacoesGerais' | 'certificadoDigital';
