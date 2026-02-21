import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LocalAtendimentoEntity } from '../../local-atendimento/local-atendimento.entity';

@Entity('gerencia_agendamento')
export class GerenciaAgendamentoEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'varchar', nullable: true })
  intervaloEntrevista!: string;

  @Column()
  numeroAtendimentoIntervalo!: number;

  @Column({ type: 'varchar', nullable: true })
  horarioInicioMatutino!: string;

  @Column({ type: 'varchar', nullable: true })
  horarioFimMatutino!: string;

  @Column({ type: 'varchar', nullable: true })
  horarioInicioVespertino!: string;

  @Column({ type: 'varchar', nullable: true })
  horarioFimVespertino!: string;

  //

  @Column({ name: 'disponibilidade_domingo', type: 'bool' })
  disponibilidadeDomingo: boolean;

  @Column({ name: 'disponibilidade_segunda', type: 'bool' })
  disponibilidadeSegunda: boolean;

  @Column({ name: 'disponibilidade_terca', type: 'bool' })
  disponibilidadeTerca: boolean;

  @Column({ name: 'disponibilidade_quarta', type: 'bool' })
  disponibilidadeQuarta: boolean;

  @Column({ name: 'disponibilidade_quinta', type: 'bool' })
  disponibilidadeQuinta: boolean;

  @Column({ name: 'disponibilidade_sexta', type: 'bool' })
  disponibilidadeSexta: boolean;

  @Column({ name: 'disponibilidade_sabado', type: 'bool' })
  disponibilidadeSabado: boolean;

  @Column({ type: 'bool', default: true })
  ativo: boolean;

  //

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(
    () => LocalAtendimentoEntity,
    (localAtendimento) => localAtendimento.gerenciaAgendamento,
    { eager: true },
  )
  @JoinColumn()
  localAtendimento!: LocalAtendimentoEntity;
}
