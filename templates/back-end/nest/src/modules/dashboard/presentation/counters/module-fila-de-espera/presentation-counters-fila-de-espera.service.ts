import { Injectable } from '@nestjs/common';
import { AcessoControl } from '../../../../../infrastructure/acesso-control';
import { PresentationCountersFilaDeEsperaCriancasTotalService } from './presentation-counters-fila-de-espera-criancas-total.service';
import { PresentationCountersFilaDeEsperaPosicoesTotalService } from './presentation-counters-fila-de-espera-posicoes-total.service';
import { PresentationCountersFilaDeEsperaEscolasTotalService } from './presentation-counters-fila-de-espera-escolas-total.service';
import { PresentationCountersFilaDeEsperaVagasConcedidasTotalService } from './presentation-counters-fila-de-espera-vagas-concedidas-total.service';
import {
  PresentationCounterFilaDeEsperaResultDto,
} from '../../types';
import { getEmptyIfNoRequiredRelation } from '../utils/getEmptyIfNoRequiredRelation';

@Injectable()
export class PresentationCountersFilaDeEsperaService {
  constructor(
    private criancasTotalService: PresentationCountersFilaDeEsperaCriancasTotalService,
    private posicoesTotalService: PresentationCountersFilaDeEsperaPosicoesTotalService,
    private escolasTotalService: PresentationCountersFilaDeEsperaEscolasTotalService,
    private vagasConcedidasTotalService: PresentationCountersFilaDeEsperaVagasConcedidasTotalService,
  ) {}

  async get(
    _acessoControl: AcessoControl,
    secretariasIds: string[] | null,
    escolasIds: string[] | null,
    referenceYear: number,
  ): Promise<PresentationCounterFilaDeEsperaResultDto> {
    if (getEmptyIfNoRequiredRelation(secretariasIds, escolasIds)) {
      return {
        totalCriancasFila: '0',
        totalPosicoesFila: '0',
        totalEscolasComCriancasNaFila: '0',
        totalReservaVagas: '0',
      };
    }

    const [
      totalCriancasFila,
      totalPosicoesFila,
      totalEscolasComCriancasNaFila,
      totalReservaVagas,
    ] = await Promise.all([
      this.criancasTotalService.get(secretariasIds, escolasIds, referenceYear),

      this.posicoesTotalService.get(secretariasIds, escolasIds, referenceYear),
      this.escolasTotalService.get(secretariasIds, escolasIds, referenceYear),

      this.vagasConcedidasTotalService.get(secretariasIds, escolasIds),
    ]);

    return {
      totalCriancasFila,
      totalPosicoesFila,
      totalEscolasComCriancasNaFila,
      totalReservaVagas,
    };
  }
}
