export enum SituacaoFuncionamento {
  ativa = 'Ativa',
  desativada = 'Desativada',
}

export enum Dependencia {
  federal = 'Federal',
  estadual = 'Estadual',
  municipal = 'Municipal',
  privada = 'Privada',
}

export enum Orgao {
  educacaoEducacao = 'Secretaria de Educação/Ministério da_Educação',
  segurancaSeguranca = 'Secretaria de Segurança Pública/Forças Armadas/Milita',
  secretariaSaude = 'Secretaria da Saúde/Ministério da Saúde',
  outro = 'Outro órgão da administração pública',
}

export enum Categoria {
  particular = 'Particular',
  confessional = 'Confessional',
  filantropica = 'Filantrópica',
  comunitaria = 'Comunitária',
}

export enum Conveniada {
  estadual = 'Estadual',
  municipal = 'Municipal',
  naoTemConvenio = 'Não tem convênio',
}

export enum Mantedora {
  privado = 'Empresa ou grupo empresarial do setor privado ou pessoa física',
  oscip = 'Organização da sociedade civil de interesse público (Oscip)',
  semFinsLucrativos = 'Instituição sem fins lucrativos',
  sincicato = 'Sindicatos de trabalhadores ou patronais, associações, cooperativas',
  ong = 'Organização não governamental (ONG) – internacional ou nacional',
  sistemaS = 'Sistema S (Sesi, Senai, Sesc, outros).',
}

export enum Regulamentacao {
  sim = 'Sim',
  nao = 'Não',
  emTramitacao = 'Em tramitação',
}

export enum Esfera {
  federal = 'Federal',
  municipal = 'Municipal',
  estadual = 'Estadual',
  privada = 'Privada',
}

export enum Unidade {
  semVinculo = 'Sem vínculo com outra instituição',
  vinculadaEducacaoBasica = 'Unidade vinculada à escola de educação básica',
  educacaoSuperior = 'Unidade ofertante de educação superior',
}

export enum Tipo {
  creche = 'Creche',
  escola = 'Escola',
}
