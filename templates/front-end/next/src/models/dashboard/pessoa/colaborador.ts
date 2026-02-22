import { IPaginatedResponse, IPaginationParams } from '@/models/common';

// ----------------------------------------------------------------------
// Enums correspondentes ao backend (simplificados)

export enum NivelAcesso {
  Administrador = 'Administrador',
  Gestor = 'Gestor',
  Analista = 'Analista',
  Operador = 'Operador',
}

export enum Cargo {
  AdministradorSistema = 'Administrador Sistema',
  Gestor = 'Gestor',
  Analista = 'Analista',
  Operador = 'Operador',
  Outro = 'Outro',
}

export enum TipoVinculoInstituicao {
  Interno = 'Interno',
  Externo = 'Externo',
}

export enum NivelEscolaridade {
  EnsinoFundamentalIncompleto = 'Ensino fundamental incompleto',
  EnsinoFundamentalCompleto = 'Ensino fundamental completo',
  EnsinoMedioIncompleto = 'Ensino médio incompleto',
  EnsinoMedioCompleto = 'Ensino médio completo',
  SuperiorIncompleto = 'Superior incompleto',
  SuperiorCompleto = 'Ensino superior completo',
  PosGraduacao = 'Pós-graduação',
  Mestrado = 'Mestrado',
  Doutorado = 'Doutorado',
}

export enum TipoEnsinoMedio {
  FormacaoGeral = 'Formação geral',
  ModalidadeNormal = 'Modalidade normal (magistério)',
  CursoTecnico = 'Curso técnico',
  MagisterioIndigena = 'Magistério indígena - modalidade normal',
}

export enum PosGraduacaoConcluida {
  Especializacao = 'Especialização',
  Mestrado = 'Mestrado',
  Doutorado = 'Doutorado',
  NaoTemPos = 'Não tem pós-graduação concluída',
}

// ----------------------------------------------------------------------
// Interfaces de Endereço e Contato

export interface IEndereco {
  id?: string;
  logradouro: string;
  numero: number;
  bairro: string;
  complemento?: string;
  pontoReferencia?: string;
  cep: string;
  cidade?: {
    id: string;
    nome: string;
    estado?: {
      id: string;
      nome: string;
      uf: string;
    };
  };
  latitude?: string;
  longitude?: string;
}

export interface IContato {
  id?: string;
  telefones: { numero: string; principal?: boolean }[];
  emails: { email: string; principal?: boolean }[];
}

// ----------------------------------------------------------------------
// Interface principal do Colaborador

export interface IColaborador {
  id: string;
  pessoa: {
    id: string;
    nome: string;
    cpf: string;
    rg: string;
    orgaoExpRg: string;
    dataNascimento: string;
    sexo: string;
    raca: string;
    nacionalidade?: string;
    paisNascimento: string;
    ufNascimento: string;
    municipioNascimento: string;
    enderecos?: IEndereco[];
    contato?: IContato;
  };
  usuario: {
    id: string;
    usuario: string;
    nivelAcesso: NivelAcesso;
    ativo: boolean;
  };
  nivelEscolaridade: NivelEscolaridade;
  tipoEnsinoMedio: TipoEnsinoMedio;
  posGraduacaoConcluida: PosGraduacaoConcluida;
  cargo: Cargo;
  tipoVinculo: TipoVinculoInstituicao | null;
  instituicaoId?: string;
  instituicaoNome?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

// ----------------------------------------------------------------------
// Interfaces para listagem

export interface IColaboradorList {
  id: string;
  nome: string;
  cpf: string;
  username: string;
  nivelAcesso: NivelAcesso;
  cargo: Cargo;
  instituicaoNome?: string;
  ativo: boolean;
}

export interface IColaboradorListResponse extends IPaginatedResponse<IColaboradorList> {}

// ----------------------------------------------------------------------
// Interface para criação/edição

export interface IColaboradorCreateUpdate {
  // Dados da Pessoa
  nome: string;
  cpf: string;
  rg: string;
  orgaoExpRg: string;
  dataNascimento: string;
  sexo: string;
  raca: string;
  nacionalidade?: string;
  paisNascimento: string;
  ufNascimento: string;
  municipioNascimento: string;
  
  // Endereço
  endereco?: IEndereco;
  
  // Contato
  contato?: IContato;
  
  // Dados do Usuário
  usuario: string;
  senha?: string;
  nivelAcesso: NivelAcesso;
  
  // Dados do Colaborador
  nivelEscolaridade: NivelEscolaridade;
  tipoEnsinoMedio: TipoEnsinoMedio;
  posGraduacaoConcluida: PosGraduacaoConcluida;
  cargo: Cargo;
  tipoVinculo?: TipoVinculoInstituicao;
  instituicaoId?: string;
  instituicaoNome?: string;
}

// ----------------------------------------------------------------------
// Interface para alteração de senha

export interface IColaboradorChangePassword {
  username: string;
  password: string;
}

// ----------------------------------------------------------------------
// Parâmetros de listagem

export interface IColaboradorListParams extends Omit<IPaginationParams, 'search'> {
  search?: string;
  'filter.cargo'?: string;
  'filter.nivelAcesso'?: string;
}
