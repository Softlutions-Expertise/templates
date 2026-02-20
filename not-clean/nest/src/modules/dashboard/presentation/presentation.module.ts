import { Module } from '@nestjs/common';
import { EscolaModule } from '../../escola/escola.module';
import { FilaModule } from '../../fila/fila.module';
import { PresentationCountersModule } from './counters/presentation-counters.module';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';

@Module({
  imports: [PresentationCountersModule, EscolaModule, FilaModule.register()],
  controllers: [PresentationController],
  providers: [PresentationService],
  exports: [PresentationService],
})
export class PresentationModule { }
