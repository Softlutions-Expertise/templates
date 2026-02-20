import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ValidatorModule } from '../../helpers/validators/validator.module';
import { ReservaVagaService } from './reserva-vaga.service';
import { ReservaVagaController } from './reserva-vaga.controller';
import { reserva_vagaProvider } from '../providers/reserva-vaga.provider';
import { EscolaModule } from '../escola/escola.module';
import { EntrevistaModule } from '../entrevista/entrevista.module';

@Module({
  imports: [DatabaseModule, ValidatorModule, EntrevistaModule, EscolaModule],
  controllers: [ReservaVagaController],
  providers: [
    ...reserva_vagaProvider, 
    ReservaVagaService
  ],
  exports: [ReservaVagaService]
})
export class ReservaVagaModule {}
