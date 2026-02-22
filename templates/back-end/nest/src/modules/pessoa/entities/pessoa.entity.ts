import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContatoEntity } from '../../base/entities/contato.entity';
import { EnderecoEntity } from '../../base/entities/endereco.entity';
import { Nacionalidade, Raca, Sexo } from './enums/pessoa.enum';

@Entity('pessoa')
export class PessoaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  foto!: string;

  @Column()
  nome!: string;

  @Column({ length: 11, unique: true })
  cpf!: string;

  @Column()
  rg!: string;

  @Column()
  orgaoExpRg!: string;

  @Column({ type: 'date' })
  dataNascimento!: Date;

  @Column({ type: 'enum', enum: Sexo })
  sexo!: Sexo;

  @Column({ type: 'enum', enum: Raca })
  raca!: Raca;

  @Column({
    type: 'enum',
    enum: Nacionalidade,
    default: Nacionalidade.Brasileira,
    nullable: true,
  })
  nacionalidade!: Nacionalidade;

  @Column()
  paisNascimento!: string;

  @Column({ length: 2 })
  ufNascimento!: string;

  @Column()
  municipioNascimento!: string;

  @Column({ nullable: true })
  municipioNascimentoId!: string;

  @ManyToMany(() => EnderecoEntity, { cascade: ['remove'] })
  @JoinTable({
    name: 'pessoa_endereco',
    joinColumn: { name: 'pessoa_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'endereco_id',
      referencedColumnName: 'id',
    },
  })
  enderecos?: EnderecoEntity[];

  @OneToOne(() => ContatoEntity)
  @JoinColumn({ name: 'contato_id', referencedColumnName: 'id' })
  contato?: ContatoEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
