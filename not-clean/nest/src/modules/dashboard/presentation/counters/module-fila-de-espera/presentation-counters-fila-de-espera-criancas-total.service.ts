import { Injectable } from '@nestjs/common';
import { DatabaseContextService } from '../../../../../infrastructure/database-context/database-context.service';
import { FilaService } from '../../../../fila/fila.service';
import { getCountOrFallback } from '../utils/getCountOrFallback';

@Injectable()
export class PresentationCountersFilaDeEsperaCriancasTotalService {
  constructor(
    private databaseContextService: DatabaseContextService,
    private filaService: FilaService,
  ) {}

  async get(
    secretariasIds: string[] | null,
    escolasIds: string[] | null,
    referenceYear: number,
  ) {
    const qbFilas = await this.filaService.prepareLastFilasQueryBuilder(
      secretariasIds,
      escolasIds,
      {
        year: referenceYear,
        compare: '>=',
      },
    );

    const filas = await this.filaService.getMappedLastFilasByQueryBuilder(
      qbFilas,
    );

    const filasIds = filas.map((entry) => entry.fila.id);

    if (filasIds.length === 0) {
      return '0';
    }

    const { criancaRepository } = this.databaseContextService;

    const qbCriancas = criancaRepository.createQueryBuilder('crianca');

    qbCriancas.innerJoin('crianca.entrevista', 'entrevista');
    qbCriancas.innerJoin('entrevista.filaGeradaPosicao', 'fila_gerada_posicao');
    qbCriancas.innerJoin('fila_gerada_posicao.filaGerada', 'fila');

    qbCriancas.where('fila.id IN (:...filasIds)', {
      filasIds,
    });

    return getCountOrFallback(qbCriancas);
  }
}
