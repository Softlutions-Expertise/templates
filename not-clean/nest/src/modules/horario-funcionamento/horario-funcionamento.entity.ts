import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EscolaEntity } from '../escola/entities/escola.entity';
import { DiaSemanaEnum } from './enums/dias-semana.enum';

@Entity('horario_funcionamento')
export class HorarioFuncionamentoEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({
    type: 'enum',
    enum: DiaSemanaEnum,
    nullable: false,
  })
  diaSemana!: DiaSemanaEnum;

  @Column({ default: false })
  ativo!: boolean;

  @Column({ type: 'time', name: 'inicio_manha', nullable: true })
  inicioManha?: string;

  @Column({ type: 'time', name: 'fim_manha', nullable: true })
  fimManha?: string;

  @Column({ type: 'time', name: 'inicio_tarde', nullable: true })
  inicioTarde?: string;

  @Column({ type: 'time', name: 'fim_tarde', nullable: true })
  fimTarde?: string;

  @ManyToOne(() => EscolaEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'escola_id' })
  escola!: EscolaEntity;
}
