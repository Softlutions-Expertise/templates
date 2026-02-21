import { Module } from '@nestjs/common';
import { PresentationCountersVagasModule } from './module-vagas/presentation-counters-vagas.module';
import { PresentationCountersService } from './presentation-counters.service';
import { PresentationCountersAgendamentosModule } from './module-agendamentos/presentation-counters-agendamentos.module';
import { PresentationCountersFilaDeEsperaModule } from './module-fila-de-espera/presentation-counters-fila-de-espera.module';
import { PresentationCountersReservasModule } from './module-reservas/presentation-counters-reservas.module';

@Module({
  imports: [
    PresentationCountersAgendamentosModule,
    PresentationCountersReservasModule,
    PresentationCountersVagasModule,
    PresentationCountersFilaDeEsperaModule,
  ],
  providers: [PresentationCountersService],
  exports: [PresentationCountersService],
})
export class PresentationCountersModule {}
