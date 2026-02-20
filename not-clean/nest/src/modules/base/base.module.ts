import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EntityExist } from '../../helpers/validators/entity-exist';
import { baseProvider } from '../providers/base.provider';
import { ArquivosController } from './controllers/arquivo.controller';
import { CidadeController } from './controllers/cidade.controller';
import { EnderecoController } from './controllers/endereco.controller';
import { CidadeService } from './services/cidade.service';
import { ContatoService } from './services/contato.service';
import { DistritoService } from './services/distrito.service';
import { EnderecoService } from './services/endereco.service';
import { EstadoService } from './services/estado.service';
import { SubdistritoService } from './services/subdistrito.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [CidadeController, EnderecoController, ArquivosController],
  providers: [
    ...baseProvider,
    EstadoService,
    CidadeService,
    EnderecoService,
    DistritoService,
    SubdistritoService,
    ContatoService,
    EntityExist,
  ],
  exports: [
    EstadoService,
    CidadeService,
    EnderecoService,
    DistritoService,
    SubdistritoService,
    ContatoService,
  ],
})
export class BaseModule {}
