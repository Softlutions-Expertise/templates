import { CriterioConfiguracaoNotaTecnica } from '../entities/criterios-configuracao-criterio.entity';

export enum CriterioDefinido {
  A = 1, // 1
  B = 2, // 2
  D = 4, // 4
  E = 5, // 5
  F = 6, // 6
}

export const CriteriosDefinidos = {
  [CriterioDefinido.A]: {
    posicao: 1,
    notaTecnica: CriterioConfiguracaoNotaTecnica.DEFINIDO,
    label:
      'Criança com deficiência conforme Art. 2º da Lei n° 13.146/15 (Estatuto da Pessoa com Deficiência)',
  },

  [CriterioDefinido.B]: {
    posicao: 2,
    notaTecnica: CriterioConfiguracaoNotaTecnica.DEFINIDO,
    label:
      'Criança está sob a guarda de mulher vítima de violência doméstica ou familiar,observado o disposto no artigo 9°, §7°, da Lei n° 11.340/06 (Lei Maria da Penha)?',
  },

  [CriterioDefinido.D]: {
    posicao: 4,
    notaTecnica: CriterioConfiguracaoNotaTecnica.DEFINIDO,
    label:
      'A família da criança está inscrita no programa federal "Auxílio Brasil" ou em programas estaduais/municipais de distribuição de renda?',
  },

  [CriterioDefinido.E]: {
    posicao: 5,
    notaTecnica: CriterioConfiguracaoNotaTecnica.DEFINIDO,
    label: 'A família da criança é monoparental?',
  },

  [CriterioDefinido.F]: {
    posicao: 6,
    notaTecnica: CriterioConfiguracaoNotaTecnica.DEFINIDO,
    label: 'A família da criança possui mãe economicamente ativa?',
  },
} as const;
