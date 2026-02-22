import { IColaborador, IColaboradorCreateUpdate } from '@/models';
import { 
  Cargo, 
  NivelAcesso, 
  NivelEscolaridade, 
  PosGraduacaoConcluida, 
  TipoEnsinoMedio 
} from '@/models/dashboard/pessoa/colaborador';

// ----------------------------------------------------------------------

export const colaboradorDefaultValues = (
  currentData?: IColaborador | null,
): IColaboradorCreateUpdate => {
  if (currentData) {
    return {
      // Dados da Pessoa
      nome: currentData.pessoa?.nome || '',
      cpf: currentData.pessoa?.cpf || '',
      rg: currentData.pessoa?.rg || '',
      orgaoExpRg: currentData.pessoa?.orgaoExpRg || '',
      dataNascimento: currentData.pessoa?.dataNascimento || '',
      sexo: currentData.pessoa?.sexo || '',
      raca: currentData.pessoa?.raca || '',
      nacionalidade: currentData.pessoa?.nacionalidade || 'Brasileira',
      paisNascimento: currentData.pessoa?.paisNascimento || 'Brasil',
      ufNascimento: currentData.pessoa?.ufNascimento || '',
      municipioNascimento: currentData.pessoa?.municipioNascimento || '',
      
      // Endereço
      endereco: currentData.pessoa?.enderecos?.[0] || {
        logradouro: '',
        numero: 0,
        bairro: '',
        complemento: '',
        pontoReferencia: '',
        cep: '',
      },
      
      // Contato
      contato: currentData.pessoa?.contato || {
        telefones: [],
        emails: [],
      },
      
      // Dados do Usuário
      usuario: currentData.usuario?.usuario || '',
      senha: '',
      nivelAcesso: currentData.usuario?.nivelAcesso || NivelAcesso.Operador,
      
      // Dados do Colaborador
      nivelEscolaridade: currentData.nivelEscolaridade || NivelEscolaridade.EnsinoMedioCompleto,
      tipoEnsinoMedio: currentData.tipoEnsinoMedio || TipoEnsinoMedio.FormacaoGeral,
      posGraduacaoConcluida: currentData.posGraduacaoConcluida || PosGraduacaoConcluida.NaoTemPos,
      cargo: currentData.cargo || Cargo.Operador,
      tipoVinculo: currentData.tipoVinculo || undefined,
      instituicaoId: currentData.instituicaoId || '',
      instituicaoNome: currentData.instituicaoNome || '',
    };
  }

  return {
    // Dados da Pessoa
    nome: '',
    cpf: '',
    rg: '',
    orgaoExpRg: '',
    dataNascimento: '',
    sexo: '',
    raca: '',
    nacionalidade: 'Brasileira',
    paisNascimento: 'Brasil',
    ufNascimento: '',
    municipioNascimento: '',
    
    // Endereço
    endereco: {
      logradouro: '',
      numero: 0,
      bairro: '',
      complemento: '',
      pontoReferencia: '',
      cep: '',
    },
    
    // Contato
    contato: {
      telefones: [],
      emails: [],
    },
    
    // Dados do Usuário
    usuario: '',
    senha: '',
    nivelAcesso: NivelAcesso.Operador,
    
    // Dados do Colaborador
    nivelEscolaridade: NivelEscolaridade.EnsinoMedioCompleto,
    tipoEnsinoMedio: TipoEnsinoMedio.FormacaoGeral,
    posGraduacaoConcluida: PosGraduacaoConcluida.NaoTemPos,
    cargo: Cargo.Operador,
    tipoVinculo: undefined,
    instituicaoId: '',
    instituicaoNome: '',
  };
};
