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
import { DistritoEntity } from './distrito.entity';
import { LocalizacaoDiferencia, Zona } from './enums/endereco.enum';
import { SubdistritoEntity } from './subdistrito.entity';

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

  @Column()
  complemento: string;

  @Column()
  pontoReferencia: string;

  @Column()
  cep: string;

  @Column({ type: 'enum', enum: LocalizacaoDiferencia })
  localizacaoDiferenciada: LocalizacaoDiferencia;

  @Column({ type: 'enum', enum: Zona })
  zona: Zona;

  @ManyToOne(() => CidadeEntity, (cidade) => cidade.enderecos, { eager: true })
  @JoinColumn({ name: 'cidade_id', referencedColumnName: 'id' })
  cidade: CidadeEntity;

  @ManyToOne(() => DistritoEntity, { eager: true })
  @JoinColumn({ name: 'distrito_id', referencedColumnName: 'id' })
  distrito: DistritoEntity;

  @ManyToOne(() => SubdistritoEntity, { eager: true })
  @JoinColumn({ name: 'subdistrito_id', referencedColumnName: 'id' })
  subdistrito: SubdistritoEntity;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
