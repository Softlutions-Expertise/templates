import { DataSource } from 'typeorm';
import { EntrevistaEntity } from '../entrevista/entities/entrevista.entity';
import { RegistrarContatoEntity } from '../entrevista/entities/registrar-contato.entity';
import { CodigoReservaVagaEntity } from '../reserva-vaga/entities/codigo-reserva-vaga.entity';
import { ReservaVagaEntity } from '../reserva-vaga/entities/reserva-vaga.entity';

export const reserva_vagaProvider = [
  {
    provide: 'RESERVA_VAGA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ReservaVagaEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CODIGO_RESERVA_VAGA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CodigoReservaVagaEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ENTREVISTA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EntrevistaEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'REGISTRO_CONTATO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RegistrarContatoEntity),
    inject: ['DATA_SOURCE'],
  },
];
