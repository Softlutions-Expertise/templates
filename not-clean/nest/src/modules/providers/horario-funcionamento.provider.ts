import { DataSource } from 'typeorm';
import { HorarioFuncionamentoEntity } from '../horario-funcionamento/horario-funcionamento.entity';

export const horario_funcionamentoProvider = [
  {
    provide: 'HORARIO_FUNCIONAMENTO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(HorarioFuncionamentoEntity),
    inject: ['DATA_SOURCE'],
  },
];
