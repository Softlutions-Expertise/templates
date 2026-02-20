import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EscolaEntity } from '../../escola/entities/escola.entity';
import { EtapaEntity } from '../../etapa/etapa.entity';

@Entity()
export class Fila {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  turno: string;

  @OneToOne(() => EscolaEntity, { eager: true })
  @JoinColumn()
  escola!: EscolaEntity;

  @ManyToOne(() => EtapaEntity, { eager: true })
  @JoinColumn({ name: 'etapa_id', referencedColumnName: 'id' })
  etapa: EtapaEntity;

  @Column()
  anoLetivo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date | null;

  @UpdateDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;
}
