import { Injectable } from '@nestjs/common';
import { AcessoControl } from '../../../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../../../infrastructure/database-context/database-context.service';
import type { PresentationCounterVagasResultDto } from '../../types';
import { getCountOrFallback } from '../utils/getCountOrFallback';
import { getEmptyIfNoRequiredRelation } from '../utils/getEmptyIfNoRequiredRelation';

@Injectable()
export class PresentationCountersVagasService {
  constructor(private databaseContextService: DatabaseContextService) {}

  get vagaRepository() {
    return this.databaseContextService.vagaRepository;
  }

  async get(
    acessoControl: AcessoControl,
    secretariasIds: string[] | null,
    escolasIds: string[] | null,
    referenceYear: number,
  ): Promise<PresentationCounterVagasResultDto> {
    if (getEmptyIfNoRequiredRelation(secretariasIds, escolasIds)) {
      return {
        cadastradas: '0',
        livres: '0',
        ocupadas: '0',
      };
    }

    const qbBase = this.vagaRepository.createQueryBuilder('vaga');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'vaga:read',
        qbBase,
      );
    }

    qbBase.innerJoin('vaga.turma', 'vaga_turma');
    qbBase.innerJoin('vaga_turma.escola', 'vaga_escola');
    qbBase.innerJoin('vaga_escola.secretariaMunicipal', 'vaga_secretaria');

    if (escolasIds) {
      if (escolasIds.length > 0) {
        qbBase.andWhere('vaga_escola.id IN (:...escolasIds)', { escolasIds });
      } else {
        qbBase.andWhere('FALSE');
      }
    } else if (secretariasIds) {
      if (secretariasIds.length > 0) {
        qbBase.andWhere('vaga_secretaria.id IN (:...secretariasIds)', {
          secretariasIds,
        });
      } else {
        qbBase.andWhere('FALSE');
      }
    }

    const totalQb = qbBase.clone();

    const referenceYearQb = totalQb.clone();
    referenceYearQb.andWhere('vaga_turma.anoLetivo >= :referenceYear', {
      referenceYear,
    });

    const ativosQb = referenceYearQb.clone();
    ativosQb.andWhere('vaga.ativa = TRUE');

    const inativosQb = referenceYearQb.clone();
    inativosQb.andWhere('vaga.ativa = FALSE');

    const cadastradas = await getCountOrFallback(referenceYearQb);
    const livres = await getCountOrFallback(ativosQb);
    const ocupadas = await getCountOrFallback(inativosQb);

    return {
      cadastradas,
      livres,
      ocupadas,
    };
  }
}
