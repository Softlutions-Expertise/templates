import { DataSource } from 'typeorm';
import { LocalAtendimentoEntity } from '../local-atendimento/local-atendimento.entity';

export const local_atendimentoProvider = [
  {
    provide: 'LOCAL_ATENDIMENTO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LocalAtendimentoEntity),
    inject: ['DATA_SOURCE'],
  },
];
