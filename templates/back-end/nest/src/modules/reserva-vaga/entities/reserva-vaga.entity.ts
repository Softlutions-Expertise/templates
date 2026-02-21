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
import { EntrevistaEntity } from '../../entrevista/entities/entrevista.entity';
import { RegistrarContatoEntity } from '../../entrevista/entities/registrar-contato.entity';
import { VagaEntity } from '../../escola/entities/vaga.entity';
import { CriancaEntity } from '../../pessoa/entities/crianca.entity';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { ReservaVagaStatusEnum } from '../enums/reserva-vaga-status.enum';
import { ReservaVagaSubstatusEnum } from '../enums/reserva-vaga-substatus.enum';

@Entity('reserva_vaga')
export class ReservaVagaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  codigoReservaVaga!: string;

  @Column({
    type: 'varchar',
    enum: ReservaVagaStatusEnum,
    default: ReservaVagaStatusEnum.PENDENTE,
  })
  status!: ReservaVagaStatusEnum;

  @Column({
    type: 'varchar',
    enum: ReservaVagaSubstatusEnum,
  })
  substatus!: ReservaVagaSubstatusEnum;

  @Column({ nullable: true })
  matricula!: string;

  @Column({ nullable: true })
  observacao!: string;

  // Data informada pelo usuário da creche referente ao deferimento/indeferimento/ausencia
  @Column()
  dataReferencia!: Date;

  @ManyToOne(() => FuncionarioEntity, { eager: true })
  @JoinColumn({ name: 'funcionario_id', referencedColumnName: 'id' })
  funcionario!: FuncionarioEntity;

  @OneToOne(() => VagaEntity, { eager: true })
  @JoinColumn({ name: 'vaga_id', referencedColumnName: 'id' })
  vaga!: VagaEntity;

  @OneToOne(() => CriancaEntity, (crianca) => crianca.reservaVaga, {
    eager: true,
  })
  @JoinColumn({ name: 'crianca_id', referencedColumnName: 'id' })
  crianca!: CriancaEntity;

  @OneToOne(() => EntrevistaEntity, (entrevista) => entrevista.reservaVaga, {
    eager: true,
  })
  @JoinColumn({ name: 'entrevista_id', referencedColumnName: 'id' })
  entrevista!: EntrevistaEntity;

  @OneToOne(() => RegistrarContatoEntity, { eager: true })
  @JoinColumn({ name: 'registro_contato_id', referencedColumnName: 'id' })
  registroContato!: RegistrarContatoEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
