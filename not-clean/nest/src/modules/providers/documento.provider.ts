import { DataSource } from 'typeorm';
import { DocumentoEntity } from '../documento/documento.entity';

export const documentoProvider = [
  {
    provide: 'DOCUMENTO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DocumentoEntity),
    inject: ['DATA_SOURCE'],
  },
];
