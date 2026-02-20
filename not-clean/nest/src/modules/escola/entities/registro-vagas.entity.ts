import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { EscolaEntity } from './escola.entity';
import { TurmaEntity } from './turma.entity';
import { VagaEntity } from './vaga.entity';

@Entity('registro_vagas')
export class RegistroVagasEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  dataHoraVaga!: string;

  @ManyToOne(() => FuncionarioEntity, { eager: true })
  @JoinColumn({ name: 'servidor_id', referencedColumnName: 'id' })
  servidor: FuncionarioEntity;

  @Column()
  anoLetivo!: string;

  @ManyToOne(() => EscolaEntity, { eager: true })
  @JoinColumn({ name: 'escola_id', referencedColumnName: 'id' })
  escola: EscolaEntity;

  @ManyToOne(() => TurmaEntity, { eager: true })
  @JoinColumn({ name: 'turma_id', referencedColumnName: 'id' })
  turma: TurmaEntity;

  @Column()
  quantidadeVagas!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  //

  @OneToMany(() => VagaEntity, (vaga) => vaga.registroVagas, { eager: false })
  vagasRel?: Relation<VagaEntity>[];
}
