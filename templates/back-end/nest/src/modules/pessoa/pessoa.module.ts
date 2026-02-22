import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ValidatorModule } from '../../helpers/validators/validator.module';
import { BaseModule } from '../base/base.module';
import { pessoaProvider } from '../providers/pessoa.provider';
import { ColaboradorController } from './controllers/colaborador.controller';
import { ColaboradorService } from './services/colaborador.service';
import { PessoaService } from './services/pessoa.service';
import { UsuarioService } from './services/usuario.service';

@Module({
  imports: [DatabaseModule, BaseModule, ValidatorModule],
  controllers: [ColaboradorController],
  providers: [
    ...pessoaProvider,
    PessoaService,
    ColaboradorService,
    UsuarioService,
  ],
})
export class PessoaModule {}
