import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EtapaEntity } from '../../etapa/etapa.entity';
import { Dias } from '../dto/create-turma.dto';
import { EscolaEntity } from './escola.entity';

@Entity('turma')
export class TurmaEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  nome!: string;

  @Column()
  turno!: string;

  @Column()
  periodoInicial!: Date;

  @Column()
  periodoFinal!: Date;

  @Column()
  horarioInicial!: string;

  @Column()
  horarioFinal!: string;

  @Column('simple-array', {})
  diasSemana!: Dias[];

  @Column()
  tipoTurma!: string;

  @Column()
  situacao!: boolean;

  @Column()
  anoLetivo!: string;

  @ManyToOne(() => EtapaEntity, { eager: true })
  @JoinColumn({ name: 'etapa_id', referencedColumnName: 'id' })
  etapa: EtapaEntity;

  @ManyToOne(() => EscolaEntity, { eager: true })
  @JoinColumn({ name: 'escola_id', referencedColumnName: 'id' })
  escola: EscolaEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
