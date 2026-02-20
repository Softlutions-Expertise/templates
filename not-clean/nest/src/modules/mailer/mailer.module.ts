import { Global, Module } from '@nestjs/common';
import { EscolaModule } from '../escola/escola.module';
import { ReservaVagaModule } from '../reserva-vaga/reserva-vaga.module';
import { MailerService } from './mailer.service';

@Global()
@Module({
  imports: [EscolaModule, ReservaVagaModule],
  providers: [MailerService],
})
export class MailerModule {}
