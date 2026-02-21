import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ValidatorModule } from '../../helpers/validators/validator.module';
import { BaseModule } from '../base/base.module';
import { LocalAtendimentoModule } from '../local-atendimento/local-atendimento.module';
import { secretaria_municipalProvider } from '../providers/secretaria-municipal.provider';
import { SecretariaMunicipalEtapaModule } from '../secretaria-municipal-etapa/secretaria-municipal-etapa.module';
import { SecretariaMunicipalController } from './secretaria-municipal.controller';
import { SecretariaMunicipalService } from './secretaria-municipal.service';

@Module({
  imports: [
    DatabaseModule,
    ValidatorModule,
    BaseModule,
    forwardRef(() => SecretariaMunicipalEtapaModule),
    LocalAtendimentoModule,
  ],
  controllers: [SecretariaMunicipalController],
  providers: [...secretaria_municipalProvider, SecretariaMunicipalService],
  exports: [SecretariaMunicipalService],
})
export class SecretariaMunicipalModule {}
