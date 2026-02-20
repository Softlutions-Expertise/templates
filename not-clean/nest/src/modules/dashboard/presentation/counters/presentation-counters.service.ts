import { Injectable } from '@nestjs/common';
import { AcessoControl } from '../../../../infrastructure/acesso-control';
import { PresentationCountersVagasService } from './module-vagas/presentation-counters-vagas.service';
import { PresentationCountersAgendamentosService } from './module-agendamentos/presentation-counters-agendamentos.service';
import { PresentationCountersFilaDeEsperaService } from './module-fila-de-espera/presentation-counters-fila-de-espera.service';
import { PresentationCountersReservasService } from './module-reservas/presentation-counters-reservas.service';

@Injectable()
export class PresentationCountersService {
  constructor(
    private presentationCounterVagasService: PresentationCountersVagasService,
    private presentationCounterReservasService: PresentationCountersReservasService,
    private presentationCounterAgendamentosService: PresentationCountersAgendamentosService,
    private presentationCounterFilaDeEsperaService: PresentationCountersFilaDeEsperaService,
  ) {}

  async getCountersReservas(
    acessoControl: AcessoControl,
    secretariasIds: string[] | null,
    escolasIds: string[] | null,
    referenceYear: number,
  ) {
    return this.presentationCounterReservasService.get(
      acessoControl,
      secretariasIds,
      escolasIds,
      referenceYear,
    );
  }

  async getCountersVagas(
    acessoControl: AcessoControl,
    secretariasIds: string[] | null,
    escolasIds: string[] | null,
    referenceYear: number,
  ) {
    return this.presentationCounterVagasService.get(
      acessoControl,
      secretariasIds,
      escolasIds,
      referenceYear,
    );
  }

  async getCountersAgendamentos(
    acessoControl: AcessoControl,
    secretariasIds: string[] | null,
    locaisAtendimentosIds: string[] | null,
    referenceDate: Date | string,
  ) {
    return this.presentationCounterAgendamentosService.get(
      acessoControl,
      secretariasIds,
      locaisAtendimentosIds,
      referenceDate,
    );
  }

  async getCountersFilasDeEspera(
    acessoControl: AcessoControl,
    secretariasIds: string[] | null,
    escolasIds: string[] | null,
    referenceYear: number,
  ) {
    return this.presentationCounterFilaDeEsperaService.get(
      acessoControl,
      secretariasIds,
      escolasIds,
      referenceYear,
    );
  }
}
