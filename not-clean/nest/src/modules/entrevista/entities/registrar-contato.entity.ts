import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CriancaEntity } from '../../pessoa/entities/crianca.entity';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { EntrevistaEntity } from './entrevista.entity';

@Entity('registrar_contato')
export class RegistrarContatoEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @ManyToOne(() => CriancaEntity, { eager: true })
  @JoinColumn({ name: 'cpf_crianca', referencedColumnName: 'cpf' })
  crianca!: CriancaEntity;

  @CreateDateColumn()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dataContato!: Date;

  @Column({ type: 'varchar', nullable: true })
  comprovante!: string;

  @Column({ type: 'varchar' })
  @IsString()
  tipoContato!: string;

  @Column({ type: 'varchar' })
  @IsString()
  nomeContato!: string;

  @Column({ type: 'varchar' })
  ligacaoAceita!: string;

  @Column({ type: 'varchar' })
  @IsString()
  observacao!: string;

  @ManyToOne(
    () => EntrevistaEntity,
    (entrevista) => entrevista.registrarContato,
    { eager: true },
  )
  @JoinColumn({ name: 'entrevista_id', referencedColumnName: 'id' })
  entrevista!: EntrevistaEntity;

  @ManyToOne(() => FuncionarioEntity, { eager: true })
  @JoinColumn({ name: 'servidor', referencedColumnName: 'id' })
  servidor!: FuncionarioEntity;
}
