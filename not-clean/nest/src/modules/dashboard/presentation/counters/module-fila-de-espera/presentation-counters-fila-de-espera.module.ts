import { Module } from '@nestjs/common';
import { PresentationCountersFilaDeEsperaService } from './presentation-counters-fila-de-espera.service';
import { PresentationCountersFilaDeEsperaCriancasTotalService } from './presentation-counters-fila-de-espera-criancas-total.service';
import { PresentationCountersFilaDeEsperaPosicoesTotalService } from './presentation-counters-fila-de-espera-posicoes-total.service';
import { PresentationCountersFilaDeEsperaEscolasTotalService } from './presentation-counters-fila-de-espera-escolas-total.service';
import { PresentationCountersFilaDeEsperaVagasConcedidasTotalService } from './presentation-counters-fila-de-espera-vagas-concedidas-total.service';
import { FilaModule } from '../../../../fila/fila.module';

@Module({
  imports: [FilaModule.register()],
  providers: [
    PresentationCountersFilaDeEsperaCriancasTotalService,
    PresentationCountersFilaDeEsperaPosicoesTotalService,
    PresentationCountersFilaDeEsperaEscolasTotalService,
    PresentationCountersFilaDeEsperaVagasConcedidasTotalService,
    PresentationCountersFilaDeEsperaService,
  ],
  exports: [PresentationCountersFilaDeEsperaService],
})
export class PresentationCountersFilaDeEsperaModule {}
