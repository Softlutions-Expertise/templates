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
import { GerenciaAgendamentoEntity } from '../agendamento/entities/gerencia-agendamento.entity';
import { ContatoEntity } from '../base/entities/contato.entity';
import { EnderecoEntity } from '../base/entities/endereco.entity';
import { SecretariaMunicipalEntity } from '../secretaria-municipal/entities/secretaria-municipal.entity';

@Entity('local_atendimento')
export class LocalAtendimentoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => EnderecoEntity)
  endereco: EnderecoEntity;

  @ManyToOne(() => ContatoEntity)
  contato: ContatoEntity;

  @ManyToOne(() => SecretariaMunicipalEntity, { eager: true })
  @JoinColumn({ name: 'secretaria_municipal_id', referencedColumnName: 'id' })
  secretariaMunicipal: SecretariaMunicipalEntity;

  @OneToOne(
    () => GerenciaAgendamentoEntity,
    (gerenciaAgendamento) => gerenciaAgendamento.localAtendimento,
  )
  gerenciaAgendamento: GerenciaAgendamentoEntity | null;
}
