import { DataSource } from 'typeorm';
import { GerenciaAgendamentoEntity } from '../agendamento/entities/gerencia-agendamento.entity';
import { AgendamentoEntity } from '../agendamento/entities/agendamento.entity';
import { DiasNaoUteisEntity } from '../agendamento/entities/dias-nao-uteis.entity';
import { LocalAtendimentoEntity } from '../local-atendimento/local-atendimento.entity';

export const agendamentoProvider = [
  {
    provide: 'GERENCIA_AGENDAMENTO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GerenciaAgendamentoEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'AGENDAMENTO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AgendamentoEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'DIAS_NAO_UTEIS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DiasNaoUteisEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'LOCAL_ATENDIMENTO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LocalAtendimentoEntity),
    inject: ['DATA_SOURCE'],
  },
];
