import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const informacoesGeraisValidationShema = yup.object().shape({
  cnpj: yup.string().required('CNPJ').cnpj(),
  razaoSocial: yup.string().required('Razão Social'),
  nomeFantasia: yup.string().required('Nome Fantasia'),
  email: yup.string().required('Email'),
  telefone: yup.string().required('Telefone'),
  inscricaoEstadual: yup.string().required('Inscrição Estadual'),
  ambiente: yup.number().required('Ambiente'),
  crt: yup.number().required('CRT'),
  csc: yup.string().required('CSC'),
  token: yup.string().required('Token'),
  contingencia: yup.boolean().required('Contingência'),
  justificativaContingencia: yup.string().required('Justificativa Contingência'),
  enderecoCep: yup.string().required('CEP'),
  enderecoEstado: yup.number().required('Estado'),
  enderecoCidadeIbge: yup.number().required('Cidade IBGE'),
  enderecoCidade: yup.string().required('Cidade'),
  enderecoBairro: yup.string().required('Bairro'),
  enderecoNumero: yup.string().required('Número'),
  enderecoLogradouro: yup.string().required('Logradouro'),
  enderecoComplemento: yup.string(),
  codigoPais: yup.string().required('Código País'),
  nomePais: yup.string().required('Nome País'),
  responsavelTecnicoCnpj: yup.string().required('CNPJ do responsável técnico').cnpj(),
  responsavelTecnicoNomeContato: yup.string().required('Nome do contato'),
  responsavelTecnicoEmail: yup.string().required('Email do responsável técnico'),
  responsavelTecnicoTelefone: yup.string().required('Telefone do responsável técnico'),
  contadorCnpj: yup.string().required('CNPJ do contador').cpfOrCnpj(),
  timezone: yup.string().required('Fuso horário'),
});

export const certificadoDigitalValidationShema = yup.object().shape({
  certificadoDigital: yup.mixed().nullable(),
  senhaCertificado: yup.string(),
  validadeCertificado: yup.string(),
});

export const parametroValidationShema = yup.object().shape({
  ...informacoesGeraisValidationShema.fields,
  ...certificadoDigitalValidationShema.fields,
});
