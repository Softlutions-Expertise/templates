import { DataSource } from 'typeorm';
import { CidadeEntity } from '../base/entities/cidade.entity';
import { ContatoEntity } from '../base/entities/contato.entity';
import { DistritoEntity } from '../base/entities/distrito.entity';
import { EnderecoEntity } from '../base/entities/endereco.entity';
import { EstadoEntity } from '../base/entities/estado.entity';
import { LogCoordenadaEntity } from '../base/entities/log-coordenada.entity';
import { SubdistritoEntity } from '../base/entities/subdistrito.entity';

export const baseProvider = [
  {
    provide: 'ESTADO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EstadoEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CIDADE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CidadeEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ENDERECO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EnderecoEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CONTATO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ContatoEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'DISTRITO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DistritoEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'SUBDISTRITO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SubdistritoEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LOG_COORDENADA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LogCoordenadaEntity),
    inject: ['DATA_SOURCE'],
  },
];
