import { Module } from '@nestjs/common';
import { PresentationCountersVagasService } from './presentation-counters-vagas.service';

@Module({
  imports: [],
  providers: [PresentationCountersVagasService],
  exports: [PresentationCountersVagasService],
})
export class PresentationCountersVagasModule {}
