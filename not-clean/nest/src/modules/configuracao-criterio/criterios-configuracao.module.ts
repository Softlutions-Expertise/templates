import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { secretaria_municipalProvider } from '../providers/secretaria-municipal.provider';
import { CriteriosConfiguracaoController } from './criterios-configuracao.controller';
import { CriteriosConfiguracaoService } from './criterios-configuracao.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CriteriosConfiguracaoController],
  providers: [CriteriosConfiguracaoService, ...secretaria_municipalProvider],
  exports: [CriteriosConfiguracaoService],
})
export class CriteriosConfiguracaoModule {}
