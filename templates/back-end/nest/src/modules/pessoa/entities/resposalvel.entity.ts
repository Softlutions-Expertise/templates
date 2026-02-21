import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsBoolean, IsOptional } from 'class-validator';
import { IsCPF } from '../../../helpers/validators/cpf-cnpj.validator';
import { Sexo } from './enums/pessoa.enum';

@Entity('responsavel')
export class ResponsavelEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nomeRes: string;

  @Column()
  @IsCPF()
  cpfRes: string;

  @Column()
  dataNascimentoRes: string;

  @Column()
  nacionalidadeRes: string;

  @Column()
  @IsOptional()
  registroNacionalEstrangeiroRes: string;

  @Column()
  @IsOptional()
  protocoloRefugioRes: string;

  @Column()
  sexoRes: Sexo;

  @Column()
  parentesco: string;

  @Column()
  estadoCivil: string;

  @Column()
  profissao: string;

  @Column()
  @IsBoolean()
  falecido: boolean;

  @Column()
  @IsBoolean()
  resideCrianca: boolean;

  @Column()
  @IsBoolean()
  exerceAtividadeProfissional: boolean;

  @Column()
  cepLocalTrabalhoResponsavel: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
