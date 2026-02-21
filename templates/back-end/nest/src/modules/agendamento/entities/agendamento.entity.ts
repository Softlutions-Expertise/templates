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
import { CidadeEntity } from '../../base/entities/cidade.entity';
import { LocalAtendimentoEntity } from '../../local-atendimento/local-atendimento.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';

@Entity('agendamento')
export class AgendamentoEntity {
  @PrimaryGeneratedColumn()
  readonly id!: string;

  @CreateDateColumn()
  data!: Date;

  @Column()
  horario!: string;

  @Column({ type: 'boolean' })
  reagendamentoEmProgresso: boolean;

  @Column({ type: 'varchar' })
  nomeCrianca!: string;

  @Column({ type: 'varchar' })
  cpfCrianca!: string;

  @CreateDateColumn()
  dataNascimento!: Date;

  @Column({ type: 'varchar' })
  nomeRes!: string;

  @Column({ type: 'varchar' })
  cpfRes!: string;

  @Column({ type: 'varchar' })
  telefone!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  status: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => CidadeEntity, { eager: true })
  @JoinColumn({ name: 'cidade_id', referencedColumnName: 'id' })
  municipio: CidadeEntity;

  @OneToOne(() => SecretariaMunicipalEntity, { eager: true })
  @JoinColumn({ name: 'secretaria_municipal_id' })
  secretariaMunicipal!: SecretariaMunicipalEntity;

  @ManyToOne(() => LocalAtendimentoEntity, { eager: true })
  @JoinColumn({ name: 'local_atendimento_id', referencedColumnName: 'id' })
  localAtendimento!: LocalAtendimentoEntity;
}
