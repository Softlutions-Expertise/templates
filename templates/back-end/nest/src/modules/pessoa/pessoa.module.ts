import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ValidatorModule } from '../../helpers/validators/validator.module';
import { BaseModule } from '../base/base.module';
import { DocumentoModule } from '../documento/documento.module';
import { EntrevistaModule } from '../entrevista/entrevista.module';
import { EscolaService } from '../escola/services/escola.service';
import { HorarioFuncionamentoModule } from '../horario-funcionamento/horario-funcionamento.module';
import { LocalAtendimentoModule } from '../local-atendimento/local-atendimento.module';
import { escolaProvider } from '../providers/escola.provider';
import { pessoaProvider } from '../providers/pessoa.provider';
import { secretaria_municipalProvider } from '../providers/secretaria-municipal.provider';
import { SecretariaMunicipalEtapaModule } from '../secretaria-municipal-etapa/secretaria-municipal-etapa.module';
import { SecretariaMunicipalModule } from '../secretaria-municipal/secretaria-municipal.module';
import { SecretariaMunicipalService } from '../secretaria-municipal/secretaria-municipal.service';
import { CriancaController } from './controllers/crianca.controller';
import { FuncionarioController } from './controllers/funcionario.controller';
import { CriancaService } from './services/crianca.service';
import { FuncionarioService } from './services/funcionario.service';
import { PessoaService } from './services/pessoa.service';
import { ResponsavelService } from './services/responsavel.service';
import { UsuarioService } from './services/usuario.service';

@Module({
  imports: [
    DatabaseModule,
    BaseModule,
    ValidatorModule,
    SecretariaMunicipalModule,
    SecretariaMunicipalEtapaModule,
    LocalAtendimentoModule,
    DocumentoModule,
    HorarioFuncionamentoModule,
    EntrevistaModule,
  ],
  controllers: [FuncionarioController, CriancaController],
  providers: [
    ...pessoaProvider,
    PessoaService,
    CriancaService,
    ResponsavelService,
    FuncionarioService,
    UsuarioService,
    ...secretaria_municipalProvider,
    SecretariaMunicipalService,
    ...escolaProvider,
    EscolaService,
  ],
})
export class PessoaModule { }
