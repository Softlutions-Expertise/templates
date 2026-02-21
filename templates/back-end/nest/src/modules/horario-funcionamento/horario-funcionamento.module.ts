import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { horario_funcionamentoProvider } from '../providers/horario-funcionamento.provider';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';

@Module({
  imports: [DatabaseModule],
  providers: [...horario_funcionamentoProvider, HorarioFuncionamentoService],
  controllers: [],
  exports: [...horario_funcionamentoProvider, HorarioFuncionamentoService],
})
export class HorarioFuncionamentoModule {}
