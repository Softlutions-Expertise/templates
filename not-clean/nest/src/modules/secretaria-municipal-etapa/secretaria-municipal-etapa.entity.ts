import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EtapaEntity } from '../etapa/etapa.entity';
import { SecretariaMunicipalEntity } from '../secretaria-municipal/entities/secretaria-municipal.entity';

@Entity('secretaria_municipal_etapa')
export class SecretariaMunicipalEtapaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float' })
  idadeInicial!: number;

  @Column({ type: 'float' })
  idadeFinal!: number;

  @Column()
  ativa!: boolean;

  @ManyToOne(
    () => SecretariaMunicipalEntity,
    (secretariaMunicipal) => secretariaMunicipal.secretariaMunicipalEtapas,
  )
  @JoinColumn({ name: 'secretaria_municipal_id' })
  secretariaMunicipal!: SecretariaMunicipalEntity;

  @ManyToOne(() => EtapaEntity, (etapa) => etapa.secretariaMunicipalEtapas)
  @JoinColumn({ name: 'etapa_id' })
  etapa!: EtapaEntity;

  @Column()
  apelido!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
