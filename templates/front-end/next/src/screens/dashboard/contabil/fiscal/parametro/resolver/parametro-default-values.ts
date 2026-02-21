import {
  IParametroCertificadoDigital,
  IParametroInformacoesGerais,
  IParametroUpdate,
} from '@/models';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const informacoesGeraisDefaultValues = (currentData?: IParametroInformacoesGerais) => ({
  cnpj: currentData?.cnpj || '',
  razaoSocial: currentData?.razaoSocial || '',
  nomeFantasia: currentData?.nomeFantasia || '',
  email: currentData?.email || '',
  telefone: currentData?.telefone || '',
  inscricaoEstadual: currentData?.inscricaoEstadual || '',
  ambiente: currentData?.ambiente?.cod ?? '',
  crt: currentData?.crt?.cod ?? '',
  csc: currentData?.csc || '',
  token: currentData?.token || '',
  contingencia: currentData?.contingencia ?? false,
  justificativaContingencia: currentData?.justificativaContingencia || '',
  enderecoCep: currentData?.enderecoCep ?? '',
  enderecoEstado: currentData?.enderecoEstado?.cod ?? '',
  enderecoCidadeIbge: currentData?.enderecoCidadeIbge ?? '',
  enderecoCidade: currentData?.enderecoCidade || '',
  enderecoBairro: currentData?.enderecoBairro || '',
  enderecoNumero: currentData?.enderecoNumero || '',
  enderecoLogradouro: currentData?.enderecoLogradouro || '',
  enderecoComplemento: currentData?.enderecoComplemento || '',
  codigoPais: currentData?.codigoPais || '',
  nomePais: currentData?.nomePais || '',
  responsavelTecnicoCnpj: currentData?.responsavelTecnicoCnpj || '',
  responsavelTecnicoNomeContato: currentData?.responsavelTecnicoNomeContato || '',
  responsavelTecnicoEmail: currentData?.responsavelTecnicoEmail || '',
  responsavelTecnicoTelefone: currentData?.responsavelTecnicoTelefone || '',
  contadorCnpj: currentData?.contadorCnpj || '',
  timezone: currentData?.timezone || '',
});

const certificadoDigitalDefaultValues = (currentData?: IParametroCertificadoDigital) => ({
  certificadoDigital: currentData?.certificadoDigital || null,
  senhaCertificado: currentData?.senhaCertificado || '',
  validadeCertificado: currentData?.validadeCertificado || '',
});

export const parametroDefaultValues = (currentData?: IParametroUpdate) => {
  return useMemo(() => {
    return {
      ...informacoesGeraisDefaultValues(currentData),
      ...certificadoDigitalDefaultValues(currentData),
    };
  }, [currentData]);
};
