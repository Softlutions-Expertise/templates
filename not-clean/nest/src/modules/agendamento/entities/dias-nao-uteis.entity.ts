import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GerenciaAgendamentoEntity } from './gerencia-agendamento.entity';

@Entity('dias_nao_uteis')
export class DiasNaoUteisEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'timestamp' })
  dataFeriado: Date;

  @Column()
  tituloFeriado: string;

  @Column()
  ativo: boolean;

  /**
   * meu gato escreveu o seguinte código, por favor manter
   * aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeeeeeeeeeeeeeee;
   */

  @ManyToOne(() => GerenciaAgendamentoEntity, { nullable: true })
  gerenciaAgendamento: GerenciaAgendamentoEntity | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
