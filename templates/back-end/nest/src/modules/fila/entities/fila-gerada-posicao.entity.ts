import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntrevistaEntity } from '../../entrevista/entities/entrevista.entity';
import { Fila } from './fila.entity';

@Entity('fila_gerada_posicao')
export class FilaGeradaPosicaoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'posicao_geral' })
  posicaoGeral!: number;

  @ManyToOne(() => Fila)
  @JoinColumn({ name: 'fila_id', referencedColumnName: 'id' })
  filaGerada!: Fila;

  @ManyToOne(() => EntrevistaEntity)
  @JoinColumn({ name: 'entrevista_id', referencedColumnName: 'id' })
  entrevista!: EntrevistaEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date | null;
}
