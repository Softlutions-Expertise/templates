import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EscolaEntity } from '../escola/entities/escola.entity';

@Entity('documento')
export class DocumentoEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  nome: string;

  @ManyToOne(() => EscolaEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'escola_id', referencedColumnName: 'id' })
  escola: EscolaEntity;
}
