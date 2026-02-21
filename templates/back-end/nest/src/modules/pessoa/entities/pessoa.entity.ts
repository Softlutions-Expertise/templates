import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContatoEntity } from '../../base/entities/contato.entity';
import { EnderecoEntity } from '../../base/entities/endereco.entity';
import { Nacionalidade, Raca, Sexo } from './enums/pessoa.enum';
import { FuncionarioEntity } from './funcionario.entity';

@Entity('pessoa')
export class PessoaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  foto!: string;

  @Column()
  nome!: string;

  @Column()
  cpf!: string;

  @Column()
  rg!: string;

  @Column()
  orgaoExpRg!: string;

  @Column({ type: 'date' })
  dataNascimento!: string;

  @Column({ type: 'enum', enum: Sexo })
  sexo!: Sexo;

  @Column({ type: 'enum', enum: Raca })
  raca!: Raca;

  @Column({
    type: 'enum',
    enum: Nacionalidade,
    default: Nacionalidade.Brasileira,
  })
  nacionalidade!: Nacionalidade;

  @Column()
  paisNascimento!: string;

  @Column()
  ufNascimento!: string;

  @Column()
  municipioNascimento!: string;

  @Column()
  municipioNascimentoId!: string;

  @ManyToMany(() => EnderecoEntity, { cascade: ['remove'], onDelete:"CASCADE", onUpdate:"CASCADE" })
  @JoinTable({
    name: 'pessoa_endereco',
    joinColumn: { name: 'pessoa_id', referencedColumnName: 'id', },
    inverseJoinColumn: {
      name: 'endereco_id',
      referencedColumnName: 'id',
    },
  })
  enderecos?: EnderecoEntity[];

  @OneToMany(() => FuncionarioEntity, (funcionario) => funcionario.pessoa)
  funcionario!: FuncionarioEntity[];

  @OneToOne(() => ContatoEntity)
  @JoinColumn({ name: 'contato_id', referencedColumnName: 'id' })
  contato?: ContatoEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
