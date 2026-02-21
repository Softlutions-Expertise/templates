import { DataSource } from 'typeorm';
import { Fila } from './entities/fila.entity';
import { FilaGeradaPosicaoEntity } from './entities/fila-gerada-posicao.entity';

export const filaProvider = [
  {
    provide: 'FILA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Fila),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'FILA_GERADA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FilaGeradaPosicaoEntity),
    inject: ['DATA_SOURCE'],
  },
];
