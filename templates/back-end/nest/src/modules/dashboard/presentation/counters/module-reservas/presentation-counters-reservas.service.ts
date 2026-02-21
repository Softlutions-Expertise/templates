import { Injectable } from '@nestjs/common';
import { AcessoControl } from '../../../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../../../infrastructure/database-context/database-context.service';
import { getCountOrFallback } from '../utils/getCountOrFallback';
import { getEmptyIfNoRequiredRelation } from '../utils/getEmptyIfNoRequiredRelation';
import { ReservaVagaStatusEnum } from '../../../../reserva-vaga/enums/reserva-vaga-status.enum';

type TodoPresentationCounterReservasResultDto = {
  pendentes: string;
  deferidas: string;
  indeferidas: string;
};

@Injectable()
export class PresentationCountersReservasService {
  constructor(private databaseContextService: DatabaseContextService) {}

  get reservaVagaRepository() {
    return this.databaseContextService.reservaVagaRepository;
  }

  async get(
    acessoControl: AcessoControl,
    secretariasIds: string[] | null,
    escolasIds: string[] | null,
    referenceYear: number,
  ): Promise<TodoPresentationCounterReservasResultDto> {
    if (getEmptyIfNoRequiredRelation(secretariasIds, escolasIds)) {
      return {
        pendentes: '0',
        deferidas: '0',
        indeferidas: '0',
      };
    }

    const qbBase =
      this.reservaVagaRepository.createQueryBuilder('reserva_vaga');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'reserva_vaga:read',
        qbBase,
      );
    }

    qbBase.innerJoin('reserva_vaga.vaga', 'vaga');

    qbBase.innerJoin('vaga.turma', 'vaga_turma');
    qbBase.innerJoin('vaga_turma.escola', 'vaga_escola');
    qbBase.innerJoin('vaga_escola.secretariaMunicipal', 'vaga_secretaria');

    if (escolasIds) {
      if (escolasIds.length > 0) {
        qbBase.andWhere('vaga_escola.id IN (:...escolasIds)', {
          escolasIds,
        });
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

    const pendenteQb = referenceYearQb.clone();
    pendenteQb.andWhere('reserva_vaga.status = :statusPendente', {
      statusPendente: ReservaVagaStatusEnum.PENDENTE,
    });

    const deferidaQb = referenceYearQb.clone();
    deferidaQb.andWhere('reserva_vaga.status = :statusDeferida', {
      statusDeferida: ReservaVagaStatusEnum.DEFERIDA,
    });

    const indeferidaQb = referenceYearQb.clone();
    indeferidaQb.andWhere('reserva_vaga.status = :statusIndeferida', {
      statusIndeferida: ReservaVagaStatusEnum.INDEFERIDA,
    });

    const pendentes = await getCountOrFallback(pendenteQb);
    const deferidas = await getCountOrFallback(deferidaQb);
    const indeferidas = await getCountOrFallback(indeferidaQb);

    return {
      pendentes,
      deferidas,
      indeferidas
    };
  }
}
