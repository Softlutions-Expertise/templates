import { Module } from '@nestjs/common';
import { PresentationCountersReservasService } from './presentation-counters-reservas.service';

@Module({
  imports: [],
  providers: [PresentationCountersReservasService],
  exports: [PresentationCountersReservasService],
})
export class PresentationCountersReservasModule {}
