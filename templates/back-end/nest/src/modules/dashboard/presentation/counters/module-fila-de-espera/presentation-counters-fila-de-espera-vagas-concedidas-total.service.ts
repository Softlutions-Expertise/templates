import { Injectable } from '@nestjs/common';
import { DatabaseContextService } from '../../../../../infrastructure/database-context/database-context.service';
import { getCountOrFallback } from '../utils/getCountOrFallback';

@Injectable()
export class PresentationCountersFilaDeEsperaVagasConcedidasTotalService {
  constructor(private databaseContextService: DatabaseContextService) {}

  private get reservaVagaRepository() {
    return this.databaseContextService.reservaVagaRepository;
  }

  async get(secretariasIds: string[] | null, escolasIds: string[] | null) {
    const qb = this.reservaVagaRepository.createQueryBuilder('reserva_vaga');

    qb.innerJoin('reserva_vaga.entrevista', 'entrevista');

    if (secretariasIds) {
      qb.innerJoin('entrevista.secretariaMunicipal', 'secretaria_municipal');
      qb.andWhere('secretaria_municipal.id IN (:...secretariasIds)', {
        secretariasIds,
      });
    }

    if (escolasIds) {
      qb.innerJoin('entrevista.preferenciaUnidade', 'unidade_escolar_1');
      qb.innerJoin('entrevista.preferenciaUnidade2', 'unidade_escolar_2');
      qb.andWhere(
        'unidade_escolar_1.id IN (:...escolasIds) OR unidade_escolar_2.id IN (:...escolasIds)',
        { escolasIds },
      );
    }

    return getCountOrFallback(qb);
  }
}
