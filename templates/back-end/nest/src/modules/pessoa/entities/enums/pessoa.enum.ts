export enum Sexo {
  Masculino = 'Masculino',
  Feminino = 'Feminino',
  Outro = 'Outro',
}

export enum Raca {
  Branca = 'Branca',
  Preta = 'Preta',
  Parda = 'Parda',
  Amarela = 'Amarela',
  Indigena = 'Indígena',
  NaoDeclarada = 'Não declarada',
}

export enum Nacionalidade {
  Brasileira = 'Brasileira',
  Estrangeira = 'Estrangeira',
  BrasileiraNaturalizada = 'Brasileira-naturalizada',
}

export enum ResponsavelTransporteEscolar {
  Municipal = 'Municipal',
  Estadual = 'Estadual',
}

export enum TransporteRodoviario {
  Bicicleta = 'Bicicleta',
  MicroOnibus = 'Micro-ônibus',
  Onibus = 'Ônibus',
  TracaoAnimal = 'Tração animal',
  VansKombi = 'Vans/Kombi',
  OutroTipo = 'Outro tipo de veículo rodoviário',
}

export enum TransporteAquaviario {
  CapacidadeAte5 = 'Capacidade de até 5 alunos',
  Capacidade5a15 = 'Capacidade de 5 a 15 alunos',
  Capacidade15a35 = 'Capacidade de 15 a 35 alunos',
  CapacidadeAcima35 = 'Capacidade acima de 35 alunos',
}

export enum Parentesco {
  Pai = 'Pai',
  Mae = 'Mãe',
  Tio = 'Tio',
  Tia = 'Tia',
  Outro = 'Outro',
}

export enum ResponsavelLegal {
  Pai = 'Pai',
  Mae = 'Mãe',
  Outro = 'Outro',
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
export enum OutrosCursosExpecificos {
  Creche = 'Creche (0 a 3 anos)',
  AnosFinaisEnsinoFundamental = 'Anos finais do ensino fundamental',
  EducacaoEspecial = 'Educação especial',
  EducacaoAmbiental = 'Educação ambiental',
  DireitoCriancaAdolecente = 'Direitos de criança e adolescente',
  Outro = 'Outro',
  PreEscola = 'Pré-escola (4 e 5 anos)',
  EnsinoMedio = 'Ensino médio',
  EducacaoIndigena = 'Educação indígena',
  EducacaoDireitosHumanos = 'Educação em direitos humanos ',
  EducacaoRelacoesEtinicoRaciaisHistoriaCultura = 'Educação para as relações étnico-raciais e \n' +
    'história e cultura afro-brasileira e africana',
  Nenhum = 'Nenhum',
  AnosIniciaisEnsinoFundamental = 'Anos iniciais do ensino fundamental',
  EducacaoJovensAdultos = 'Educação de jovens e adultos',
  EducacaoCampo = 'Educação do campo',
  GeneroDiversidadeSexual = 'Gênero e diversidade sexual',
  GestaoEscolar = 'Gestão escolar',
}
export enum GrauAcademico {
  Bacharelado = 'Bacharelado',
  Licenciatura = 'Licenciatura',
  Sequencial = 'Sequencial',
  Tecnologico = 'Tecnológico',
}

export enum TipoCurso {
  Graduacao = 'Graduação',
  PosGraduacao = 'Pós-Graduação',
}
export enum TipoInstituicao {
  Publica = 'Pública',
  Privada = 'Privada',
}
export enum TipoVinculoInstituicao {
  UnidadeEscolar = 'Unidade Escolar',
  SecretariaMunicipal = 'Secretaria Municipal',
}

export enum Cargo {
  AdministradorSistema = 'Administrador Sistema',
  Gestor = 'Gestor',
  Analista = 'Analista',
  Operador = 'Operador',
  Outro = 'Outro',
}

export enum NivelAcesso {
  Defensoria = 'Defensoria',
  Administrador = 'Administrador',
  AdministradorMunicipal = 'Administrador Municipal',
  AtendenteSecretaria = 'Atendente Secretaria',
  GestorCreche = 'Gestor de Creche',
}
