import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { local_atendimentoProvider } from '../providers/local-atendimento.provider';
import { secretaria_municipalProvider } from '../providers/secretaria-municipal.provider';
import { LocalAtendimentoController } from './local-atendimento.controller';
import { LocalAtendimentoService } from './local-atendimento.service';

@Module({
  imports: [DatabaseModule],
  controllers: [LocalAtendimentoController],
  providers: [
    ...local_atendimentoProvider,
    ...secretaria_municipalProvider,
    LocalAtendimentoService,
  ],
  exports: [LocalAtendimentoService],
})
export class LocalAtendimentoModule {}
