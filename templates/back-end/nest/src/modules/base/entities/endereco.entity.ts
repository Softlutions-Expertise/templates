import { Allow } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CidadeEntity } from './cidade.entity';
import { LocalizacaoDiferencia as LocalizacaoDiferenciada, Zona } from './enums/endereco.enum';

@Entity('base_endereco')
export class EnderecoEntity {
  @PrimaryGeneratedColumn('uuid')
  @Allow()
  id: string;

  @Column()
  logradouro: string;

  @Column()
  numero: number;

  @Column()
  bairro: string;

  @Column({ nullable: true })
  complemento: string;

  @Column({ nullable: true })
  pontoReferencia: string;

  @Column()
  cep: string;

  @Column({ type: 'enum', enum: LocalizacaoDiferenciada, nullable: true })
  localizacaoDiferenciada: LocalizacaoDiferenciada;

  @Column({ type: 'enum', enum: Zona, nullable: true })
  zona: Zona;

  @ManyToOne(() => CidadeEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'cidade_id', referencedColumnName: 'id' })
  cidade: CidadeEntity;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
