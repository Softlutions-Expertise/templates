import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ValidatorModule } from '../../helpers/validators/validator.module';
import { BaseModule } from '../base/base.module';
import { DocumentoModule } from '../documento/documento.module';
import { HorarioFuncionamentoModule } from '../horario-funcionamento/horario-funcionamento.module';
import { escolaProvider } from '../providers/escola.provider';
import { EscolaController } from './controllers/escola.controller';
import { RegistroVagasController } from './controllers/registro-vagas.controller';
import { TurmaController } from './controllers/turma.controller';
import { VagasController } from './controllers/vaga.controller';
import { EscolaOpcaoRepository } from './repositories/escola-opcao.repository';
import { EscolaService } from './services/escola.service';
import { RegistroVagasService } from './services/registro-vagas.service';
import { TurmaService } from './services/turma.service';
import { VagasService } from './services/vagas.service';

@Module({
  imports: [
    DatabaseModule,
    ValidatorModule,
    BaseModule,
    DocumentoModule,
    HorarioFuncionamentoModule,
  ],
  controllers: [
    EscolaController,
    TurmaController,
    RegistroVagasController,
    VagasController,
  ],
  providers: [
    ...escolaProvider,
    EscolaService,
    TurmaService,
    RegistroVagasService,
    VagasService,
    EscolaOpcaoRepository,
  ],
  exports: [RegistroVagasService, VagasService, TurmaService],
})
export class EscolaModule {}
