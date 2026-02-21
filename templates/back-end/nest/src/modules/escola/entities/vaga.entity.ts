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
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { ReservaVagaEntity } from '../../reserva-vaga/entities/reserva-vaga.entity';
import { EscolaEntity } from './escola.entity';
import { RegistroVagasEntity } from './registro-vagas.entity';
import { TurmaEntity } from './turma.entity';

@Entity('vagas')
export class VagaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  dataHoraVaga!: string;

  @ManyToOne(() => FuncionarioEntity, { eager: true })
  @JoinColumn({ name: 'servidor_id', referencedColumnName: 'id' })
  servidor: FuncionarioEntity;

  @Column()
  anoLetivo!: string;

  @Column()
  ativa!: boolean;

  // Relacionamento com a tabela reserva_vaga - Inverse Join Column
  @OneToOne(() => ReservaVagaEntity, (reservaVaga) => reservaVaga.vaga)
  reservaVaga: ReservaVagaEntity;

  @ManyToOne(() => EscolaEntity, { eager: true })
  @JoinColumn({ name: 'escola_id', referencedColumnName: 'id' })
  escola: EscolaEntity;

  @ManyToOne(() => TurmaEntity, { eager: true })
  @JoinColumn({ name: 'turma_id', referencedColumnName: 'id' })
  turma: TurmaEntity;

  @ManyToOne(() => RegistroVagasEntity, { eager: true })
  @JoinColumn({ name: 'registro_vagas_id', referencedColumnName: 'id' })
  registroVagas: RegistroVagasEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
