import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CidadeEntity } from '../../base/entities/cidade.entity';
import { EstadoEntity } from '../../base/entities/estado.entity';

@Entity('feriado')
export class FeriadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //

  @Column({ type: 'date' })
  data: string;

  @Column({ type: 'text' })
  titulo: string;

  //

  @ManyToOne(() => EstadoEntity, { nullable: true })
  @JoinColumn({ name: 'id_estado_fk' })
  estado: EstadoEntity | null;

  @ManyToOne(() => CidadeEntity, { nullable: true })
  @JoinColumn({ name: 'id_cidade_fk' })
  cidade: CidadeEntity | null;

  //

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
