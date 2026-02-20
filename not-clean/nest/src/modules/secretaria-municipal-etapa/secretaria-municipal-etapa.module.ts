import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ValidatorModule } from '../../helpers/validators/validator.module';
import { EtapaModule } from '../etapa/etapa.module';
import { secretaria_municipal_etapaProvider } from '../providers/secretaria-municipal-etapa.provider';
import { SecretariaMunicipalModule } from '../secretaria-municipal/secretaria-municipal.module';
import { SecretariaMunicipalEtapaController } from './secretaria-municipal-etapa.controller';
import { SecretariaMunicipalEtapaService } from './secretaria-municipal-etapa.service';

@Module({
  imports: [
    DatabaseModule,
    ValidatorModule,
    forwardRef(() => SecretariaMunicipalModule),
    forwardRef(() => EtapaModule),
  ],
  controllers: [SecretariaMunicipalEtapaController],
  providers: [
    ...secretaria_municipal_etapaProvider,
    SecretariaMunicipalEtapaService,
  ],
  exports: [SecretariaMunicipalEtapaService],
})
export class SecretariaMunicipalEtapaModule {}
