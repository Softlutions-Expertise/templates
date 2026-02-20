import { DataSource } from 'typeorm';
import { EtapaEntity } from '../etapa/etapa.entity';

export const etapaProvider = [
  {
    provide: 'ETAPA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EtapaEntity),
    inject: ['DATA_SOURCE'],
  },
];
