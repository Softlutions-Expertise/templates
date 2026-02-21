import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import { CriteriosConfiguracaoCriterioEntity } from './criterios-configuracao-criterio.entity';

@Entity('criterios_configuracao')
export class CriteriosConfiguracaoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'data_vigencia_inicio',
    type: 'timestamptz',
    nullable: true,
  })
  dataVigenciaInicio!: Date | null;

  @Column({ name: 'data_vigencia_fim', type: 'timestamptz', nullable: true })
  dataVigenciaFim!: Date | null;

  @ManyToOne(() => SecretariaMunicipalEntity)
  @JoinColumn({ name: 'secretaria_municipal_id' })
  secretariaMunicipal!: SecretariaMunicipalEntity;

  @OneToMany(
    () => CriteriosConfiguracaoCriterioEntity,
    (configuracaoCriterio) => configuracaoCriterio.criteriosConfiguracao,
    { cascade: ['remove'], onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  criteriosConfiguracaoCriterio: CriteriosConfiguracaoCriterioEntity[];
}
