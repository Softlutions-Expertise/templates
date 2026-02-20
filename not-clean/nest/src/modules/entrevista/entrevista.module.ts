import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ValidatorModule } from '../../helpers/validators/validator.module';
import { ArquivoModule } from '../../infrastructure/arquivo/arquivo.module';
import { BaseModule } from '../base/base.module';
import { CriteriosConfiguracaoModule } from '../configuracao-criterio/criterios-configuracao.module';
import { entrevistaProvider } from '../providers/entrevista.provider';
import { CriteriosController } from './controllers/criterios.controller';
import { EntrevistaController } from './controllers/entrevista.controller';
import { RegistrarContatoController } from './controllers/registrar-contato.controller';
import { CriteriosService } from './services/criterios.service';
import { EntrevistaService } from './services/entrevista.service';
import { RegistrarContatoService } from './services/registrar-contato.service';

@Module({
  imports: [
    ArquivoModule,
    CriteriosConfiguracaoModule,
    DatabaseModule,
    ValidatorModule,
    BaseModule,
  ],
  controllers: [
    CriteriosController,
    EntrevistaController,
    RegistrarContatoController,
  ],
  providers: [
    ...entrevistaProvider,
    CriteriosService,
    EntrevistaService,
    RegistrarContatoService,
  ],
  exports: [EntrevistaService],
})
export class EntrevistaModule {}
