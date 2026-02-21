import { IsInt, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';

@Entity('codigo_reserva_vaga')
export class CodigoReservaVagaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @IsInt()
  count!: number;

  @Column()
  @IsString()
  ano!: string;

  @ManyToOne(() => SecretariaMunicipalEntity, { eager: true })
  @JoinColumn({ name: 'secretaria_municipal_id', referencedColumnName: 'id' })
  secretariaMunicipal!: SecretariaMunicipalEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
