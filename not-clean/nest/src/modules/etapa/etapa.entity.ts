import { Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SecretariaMunicipalEtapaEntity } from '../secretaria-municipal-etapa/secretaria-municipal-etapa.entity';

@Entity('etapa')
export class EtapaEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  nome!: string;

  @OneToMany(
    () => SecretariaMunicipalEtapaEntity,
    (secretariaMunicipalEtapa) => secretariaMunicipalEtapa.etapa,
  )
  secretariaMunicipalEtapas: SecretariaMunicipalEtapaEntity[];

  //Campo virtual apenas para pegar os turnos disponíveis na escola em questão
  @Expose()
  turnos?: string[];
}
