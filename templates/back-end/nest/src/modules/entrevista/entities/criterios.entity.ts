import { get, has } from 'lodash';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CriteriosConfiguracaoCriterioEntity } from '../../configuracao-criterio/entities/criterios-configuracao-criterio.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import { EntrevistaMatchCriterioEntity } from './etrevista_match_criterio.entity';

@Entity('criterios')
export class CriteriosEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ name: 'nome', type: 'varchar' })
  nome!: string;

  @OneToOne(
    () => SecretariaMunicipalEntity,
    (secretariaMunicipal) => secretariaMunicipal.criterio,
    { eager: true },
  )
  @JoinColumn({ name: 'secretaria_municipal_id', referencedColumnName: 'id' })
  secretariaMunicipal!: SecretariaMunicipalEntity;

  @OneToMany(
    () => EntrevistaMatchCriterioEntity,
    (matchCriterio) => matchCriterio.entrevista,
  )
  matchCriterios!: EntrevistaMatchCriterioEntity[];

  @OneToOne(() => CriteriosConfiguracaoCriterioEntity)
  currentConfiguracaoCriterio?: CriteriosConfiguracaoCriterioEntity | null;

  @OneToMany(
    () => CriteriosConfiguracaoCriterioEntity,
    (configuracaoCriterio) => configuracaoCriterio.criterio,
    {
      cascade: ['remove'],
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  configuracoesCriterio!: CriteriosConfiguracaoCriterioEntity[];

  @AfterLoad()
  fixCurrentConfiguracaoCriterio() {
    if (
      !this.currentConfiguracaoCriterio &&
      has(this, 'currentConfiguracaoCriterio_rel')
    ) {
      this.currentConfiguracaoCriterio = get(
        this,
        'currentConfiguracaoCriterio_rel',
      ) as any;

      delete this.currentConfiguracaoCriterio_rel;
    }
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
