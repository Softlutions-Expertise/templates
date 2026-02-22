import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Cargo,
  NivelEscolaridade,
  PosGraduacaoConcluida,
  TipoEnsinoMedio,
  TipoVinculoInstituicao,
} from './enums/pessoa.enum';
import { PessoaEntity } from './pessoa.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity('colaborador')
export class ColaboradorEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => PessoaEntity, { cascade: ['remove'] })
  @JoinColumn()
  @ValidateNested()
  @Type(() => PessoaEntity)
  pessoa!: PessoaEntity;

  @OneToOne(() => UsuarioEntity, { cascade: ['remove'] })
  @JoinColumn()
  @ValidateNested()
  @Type(() => UsuarioEntity)
  usuario!: UsuarioEntity;

  @Column('enum', { enum: NivelEscolaridade })
  nivelEscolaridade!: NivelEscolaridade;

  @Column('enum', { enum: TipoEnsinoMedio })
  tipoEnsinoMedio!: TipoEnsinoMedio;

  @Column('enum', { enum: PosGraduacaoConcluida })
  posGraduacaoConcluida!: PosGraduacaoConcluida;

  @Column('enum', { enum: Cargo, nullable: true })
  cargo: Cargo | null;

  @Column('enum', { enum: TipoVinculoInstituicao, nullable: true })
  tipoVinculo: TipoVinculoInstituicao | null;

  @Column({ name: 'instituicao_id', type: 'varchar', nullable: true })
  instituicaoId: string | null;

  @Column({ name: 'instituicao_nome', type: 'varchar', nullable: true })
  instituicaoNome: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
