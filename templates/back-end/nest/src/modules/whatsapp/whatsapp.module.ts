import { Global, Module } from '@nestjs/common';
import { EscolaModule } from '../escola/escola.module';
import { ReservaVagaModule } from '../reserva-vaga/reserva-vaga.module';
import { EntrevistaModule } from '../entrevista/entrevista.module';
import { WhatsAppService } from './whatsapp.service';

@Global()
@Module({
  imports: [EscolaModule, ReservaVagaModule, EntrevistaModule],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
