import { DataSource } from 'typeorm';
import { SecretariaMunicipalEntity } from '../secretaria-municipal/entities/secretaria-municipal.entity';

export const secretaria_municipalProvider = [
  {
    provide: 'SECRETARIA_MUNICIPAL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SecretariaMunicipalEntity),
    inject: ['DATA_SOURCE'],
  },
];
