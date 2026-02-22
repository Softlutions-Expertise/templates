import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EntityExist } from '../../helpers/validators/entity-exist';
import { baseProvider } from '../providers/base.provider';
import { CidadeController } from './controllers/cidade.controller';
import { EnderecoController } from './controllers/endereco.controller';
import { CidadeService } from './services/cidade.service';
import { ContatoService } from './services/contato.service';
import { EnderecoService } from './services/endereco.service';
import { EstadoService } from './services/estado.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [CidadeController, EnderecoController],
  providers: [
    ...baseProvider,
    EstadoService,
    CidadeService,
    EnderecoService,
    ContatoService,
    EntityExist,
  ],
  exports: [
    EstadoService,
    CidadeService,
    EnderecoService,
    ContatoService,
  ],
})
export class BaseModule {}
