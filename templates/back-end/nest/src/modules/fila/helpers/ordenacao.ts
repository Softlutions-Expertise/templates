import { differenceInMilliseconds } from 'date-fns';
import { getDateTimeEntrevista } from '.';
import { CriteriosConfiguracaoCriterioEntity } from '../../configuracao-criterio/entities/criterios-configuracao-criterio.entity';
import { CriteriosEntity } from '../../entrevista/entities/criterios.entity';
import { EntrevistaEntity } from '../../entrevista/entities/entrevista.entity';

export type IClassificacaoCriterio = {
  posicao: number;
  subPosicao: number | null;
};

export const generateClassificarPesoIntervalo = (
  a_criterios: IClassificacaoCriterio[],
  b_criterios: IClassificacaoCriterio[],
) => {
  return (inicio: number, fim: number) => {
    for (let peso = inicio; peso <= fim; peso++) {
      const pesoExistenteEmA = a_criterios.find((i) => i.posicao === peso);
      const pesoExistenteEmB = b_criterios.find((i) => i.posicao === peso);

      if (pesoExistenteEmA && !pesoExistenteEmB) {
        return -1; // Somente A tem o critério, A vai primeiro
      }

      if (!pesoExistenteEmA && pesoExistenteEmB) {
        return 1; // Somente B tem o critério, B vai primeiro
      }

      if (pesoExistenteEmA && pesoExistenteEmB) {
        // inicio

        if (
          pesoExistenteEmA.subPosicao === null ||
          pesoExistenteEmB.subPosicao === null
        ) {
          // critérios fixos não possuem subPeso, portanto não precisa de desempate
          continue;
        }

        // aqui, o subPeso sempre vai ser definido.

        const a_subcriterios = a_criterios.filter((i) => i.posicao === peso);
        const b_subcriterios = b_criterios.filter((i) => i.posicao === peso);

        const menorSubpeso = [...a_subcriterios, ...b_subcriterios].reduce(
          (acc, i) => Math.min(acc, i.subPosicao),
          0,
        );

        const maiorSubpeso = [...a_subcriterios, ...b_subcriterios].reduce(
          (acc, i) => Math.max(acc, i.subPosicao),
          0,
        );

        for (let subPeso = menorSubpeso; subPeso <= maiorSubpeso; subPeso++) {
          const subPesoExistenteEmA = a_subcriterios.find(
            (i) => i.subPosicao === subPeso,
          );

          const subPesoExistenteEmB = b_subcriterios.find(
            (i) => i.subPosicao === subPeso,
          );

          if (subPesoExistenteEmA && !subPesoExistenteEmB) {
            return -1; // Somente A tem o critério, A vai primeiro
          }

          if (!subPesoExistenteEmA && subPesoExistenteEmB) {
            return 1; // Somente B tem o critério, B vai primeiro
          }
        }

        // fim
      }
    }

    return 0;
  };
};

export type EntrevistaInformacoesNecessarias = {
  idEntrevista: EntrevistaEntity['id'];
  dataEntrevista: EntrevistaEntity['dataEntrevista'];
  horarioEntrevista: EntrevistaEntity['horarioEntrevista'];
  colocacao: number;
  criteriosAtivos: {
    idCriterio: CriteriosEntity['id'];
    notaTecnica: CriteriosConfiguracaoCriterioEntity['notaTecnica'];
    posicao: CriteriosConfiguracaoCriterioEntity['posicao'];
    subPosicao: CriteriosConfiguracaoCriterioEntity['subPosicao'];
    exigirComprovacao: CriteriosConfiguracaoCriterioEntity['exigirComprovacao'];
  }[];
};

export const ordenarEntrevistasComparador = (
  a: EntrevistaInformacoesNecessarias,
  b: EntrevistaInformacoesNecessarias,
) => {
  const a_criterios = a.criteriosAtivos;
  const b_criterios = b.criteriosAtivos;

  const classificarPesoIntervalo = generateClassificarPesoIntervalo(
    a_criterios,
    b_criterios,
  );

  const diffIntervalo_1_6 = classificarPesoIntervalo(1, 6);

  if (diffIntervalo_1_6 !== 0) {
    return diffIntervalo_1_6;
  }

  const diffIntervalo_8 = classificarPesoIntervalo(8, 8);

  if (diffIntervalo_8 !== 0) {
    return diffIntervalo_8;
  }

  const dataHoraEntrevistaA = getDateTimeEntrevista(a);
  const dataHoraEntrevistaB = getDateTimeEntrevista(b);

  const diffDataEntrevista = differenceInMilliseconds(
    dataHoraEntrevistaA,
    dataHoraEntrevistaB,
  );

  return diffDataEntrevista < 0 ? -1 : 1;
};

export const ordenarEntrevistas = (
  entrevistasComInformacoesNecessarias: EntrevistaInformacoesNecessarias[],
) => {
  return Array.from(entrevistasComInformacoesNecessarias).sort(
    ordenarEntrevistasComparador,
  );
};
