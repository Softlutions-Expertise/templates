import { Injectable } from '@nestjs/common';
import { DatabaseContextService } from '../../../../../infrastructure/database-context/database-context.service';
import { FilaService } from '../../../../fila/fila.service';
import { getCountOrFallback } from '../utils/getCountOrFallback';

@Injectable()
export class PresentationCountersFilaDeEsperaPosicoesTotalService {
  constructor(private filaService: FilaService) {}

  async get(
    secretariasIds: string[] | null,
    escolasIds: string[] | null,
    referenceYear: number,
  ) {
    const qb = await this.filaService.prepareLastFilasQueryBuilder(
      secretariasIds,
      escolasIds,
      { year: referenceYear, compare: '>=' },
    );

    return getCountOrFallback(qb);
  }
}
