import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { etapaProvider } from '../providers/etapa.provider';
import { secretaria_municipalProvider } from '../providers/secretaria-municipal.provider';
import { SecretariaMunicipalEtapaModule } from '../secretaria-municipal-etapa/secretaria-municipal-etapa.module';
import { EtapaController } from './etapa.controller';
import { EtapaService } from './etapa.service';
import { EscolaModule } from '../escola/escola.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => SecretariaMunicipalEtapaModule), EscolaModule],
  controllers: [EtapaController],
  providers: [...etapaProvider, ...secretaria_municipalProvider, EtapaService],
  exports: [EtapaService],
})
export class EtapaModule {}
