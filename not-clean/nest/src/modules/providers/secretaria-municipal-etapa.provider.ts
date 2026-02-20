import { DataSource } from 'typeorm';
import { SecretariaMunicipalEtapaEntity } from '../secretaria-municipal-etapa/secretaria-municipal-etapa.entity';

export const secretaria_municipal_etapaProvider = [
  {
    provide: 'SECRETARIA_MUNICIPAL_ETAPA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SecretariaMunicipalEtapaEntity),
    inject: ['DATA_SOURCE'],
  },
];
