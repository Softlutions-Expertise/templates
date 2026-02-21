import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EscolaEntity } from '../../escola/entities/escola.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import {
  Cargo,
  NivelEscolaridade,
  PosGraduacaoConcluida,
  TipoEnsinoMedio,
  TipoVinculoInstituicao,
} from './enums/pessoa.enum';
import { PessoaEntity } from './pessoa.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity('pessoa_funcionario')
export class FuncionarioEntity {
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

  // @Column({ name: 'instituicao_id', type: 'varchar', nullable: true })
  // instituicaoId: string | null;

  //

  @ManyToMany(() => SecretariaMunicipalEntity)
  @JoinTable({
    name: 'funcionario_secretarias',
    joinColumn: { name: 'funcionario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'secretaria_id', referencedColumnName: 'id' },
  })
  secretarias: SecretariaMunicipalEntity[];


  @ManyToMany(() => EscolaEntity)
  @JoinTable({
    name: 'funcionario_escolas',
    joinColumn: { name: 'funcionario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'escola_id', referencedColumnName: 'id' },
  })
  unidadesEscolares: EscolaEntity[];

}
