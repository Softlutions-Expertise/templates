import { DataSource } from 'typeorm';
import { EscolaEntity } from '../escola/entities/escola.entity';
import { RegistroVagasEntity } from '../escola/entities/registro-vagas.entity';
import { TurmaEntity } from '../escola/entities/turma.entity';
import { VagaEntity } from '../escola/entities/vaga.entity';

export const escolaProvider = [
  {
    provide: 'ESCOLA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EscolaEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'TURMA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TurmaEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'REGISTRO_VAGAS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RegistroVagasEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'VAGAS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(VagaEntity),
    inject: ['DATA_SOURCE'],
  },
];
