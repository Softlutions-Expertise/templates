import { DataSource } from 'typeorm';
import { CriteriosEntity } from '../entrevista/entities/criterios.entity';
import { EntrevistaEntity } from '../entrevista/entities/entrevista.entity';
import { RegistrarContatoEntity } from '../entrevista/entities/registrar-contato.entity';

export const entrevistaProvider = [
  {
    provide: 'CRITERIOS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CriteriosEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ENTREVISTA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EntrevistaEntity),
    inject: ['DATA_SOURCE'],
  },
  // {
  //   provide: 'FILA_REPOSITORY',
  //   useFactory: (dataSource: DataSource) =>
  //     dataSource.getRepository(Fila),
  //   inject: ['DATA_SOURCE'],
  // },
  {
    provide: 'REGISTRO_CONTATO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RegistrarContatoEntity),
    inject: ['DATA_SOURCE'],
  },
];
