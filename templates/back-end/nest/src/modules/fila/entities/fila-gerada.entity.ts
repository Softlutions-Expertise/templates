import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CriteriosConfiguracaoEntity } from '../../configuracao-criterio/entities/criterios-configuracao.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import { FilaGeradaPosicaoEntity } from './fila-gerada-posicao.entity';

@Entity('fila_gerada')
export class FilaGeradaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //

  @Column({ name: 'data_geracao_start' })
  dataGeracaoStart!: Date;

  @Column({ name: 'data_geracao_end' })
  dataGeracaoEnd!: Date | null;

  //

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date | null;

  //

  @ManyToOne(() => SecretariaMunicipalEntity)
  @JoinColumn({ name: 'secretaria_municipal_id', referencedColumnName: 'id' })
  secretariaMunicipal!: SecretariaMunicipalEntity;

  @ManyToOne(() => CriteriosConfiguracaoEntity)
  @JoinColumn({ name: 'criterios_configuracao_id', referencedColumnName: 'id' })
  criteriosConfiguracao!: CriteriosConfiguracaoEntity | null;

  //

  @OneToMany(
    () => FilaGeradaPosicaoEntity,
    (filaGeradaPosicao) => filaGeradaPosicao.filaGerada,
  )
  filaGeradaPosicao: FilaGeradaPosicaoEntity[];
}
