import { IsOptional } from 'class-validator';
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

import { Type } from 'class-transformer';
import { ContatoEntity } from '../../base/entities/contato.entity';
import { EnderecoEntity } from '../../base/entities/endereco.entity';
import { EntrevistaEntity } from '../../entrevista/entities/entrevista.entity';
import { ReservaVagaEntity } from '../../reserva-vaga/entities/reserva-vaga.entity';
import { ResponsavelEntity } from './resposalvel.entity';

@Entity('crianca')
export class CriancaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome: string;

  @Column()
  cpf: string;

  @Column()
  sexo: string;

  @Column()
  dataNascimento: Date;

  @Column()
  numeroSUS: string;

  @Column()
  paisOrigem: string;

  @Column()
  @IsOptional()
  registroNacionalEstrangeiro: string;

  @Column()
  @IsOptional()
  protocoloRefugio: string;

  @ManyToOne(() => EnderecoEntity)
  endereco!: EnderecoEntity;

  @ManyToOne(() => ContatoEntity)
  contato!: ContatoEntity;

  @Column()
  numeroUnidadeConsumidora: string;

  @Column()
  numeroUnidadeMatriculaIPTU: string;

  @OneToOne(() => ResponsavelEntity)
  @JoinColumn()
  @Type(() => ResponsavelEntity)
  responsavel!: ResponsavelEntity;

  @OneToOne(() => ResponsavelEntity)
  @JoinColumn()
  @Type(() => ResponsavelEntity)
  responsavel2?: ResponsavelEntity;

  @OneToOne(() => ReservaVagaEntity, (reservaVaga) => reservaVaga.crianca)
  reservaVaga?: ReservaVagaEntity | null;

  @OneToOne(() => EntrevistaEntity, (entrevista) => entrevista.crianca, {
    eager: true,
  })
  entrevista?: EntrevistaEntity | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
