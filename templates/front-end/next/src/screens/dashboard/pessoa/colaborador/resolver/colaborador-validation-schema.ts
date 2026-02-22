import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const colaboradorValidationSchema = yup.object().shape({
  // Dados da Pessoa
  nome: yup.string().required('Nome é obrigatório'),
  cpf: yup.string().required('CPF é obrigatório').min(11, 'CPF inválido'),
  rg: yup.string().required('RG é obrigatório'),
  orgaoExpRg: yup.string().required('Órgão Expedidor é obrigatório'),
  dataNascimento: yup.string().required('Data de Nascimento é obrigatória'),
  sexo: yup.string().required('Sexo é obrigatório'),
  raca: yup.string().required('Raça/Cor é obrigatória'),
  paisNascimento: yup.string().required('País de Nascimento é obrigatório'),
  ufNascimento: yup.string().required('UF de Nascimento é obrigatória'),
  municipioNascimento: yup.string().required('Município de Nascimento é obrigatório'),
  
  // Endereço
  endereco: yup.object().shape({
    logradouro: yup.string().required('Logradouro é obrigatório'),
    numero: yup.number().required('Número é obrigatório'),
    bairro: yup.string().required('Bairro é obrigatório'),
    cep: yup.string().required('CEP é obrigatório'),
  }),
  
  // Dados do Usuário
  usuario: yup
    .string()
    .required('Usuário é obrigatório')
    .test('no-spaces', 'Usuário não pode conter espaços', (value) => {
      return !value || !/\s/.test(value);
    }),
  senha: yup.string().when('$isEdit', {
    is: false,
    then: (schema) => schema.required('Senha é obrigatória para novo usuário'),
    otherwise: (schema) => schema.notRequired(),
  }),
  nivelAcesso: yup.string().required('Nível de Acesso é obrigatório'),
  
  // Dados do Colaborador
  cargo: yup.string().required('Cargo é obrigatório'),
  nivelEscolaridade: yup.string().required('Nível de Escolaridade é obrigatório'),
  tipoEnsinoMedio: yup.string().required('Tipo de Ensino Médio é obrigatório'),
  posGraduacaoConcluida: yup.string().required('Pós-graduação é obrigatória'),
});
