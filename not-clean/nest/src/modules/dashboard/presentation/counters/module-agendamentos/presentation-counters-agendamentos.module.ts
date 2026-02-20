import { Module } from '@nestjs/common';
import { PresentationCountersAgendamentosService } from './presentation-counters-agendamentos.service';

@Module({
  imports: [],
  providers: [PresentationCountersAgendamentosService],
  exports: [PresentationCountersAgendamentosService],
})
export class PresentationCountersAgendamentosModule {}
