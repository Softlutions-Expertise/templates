import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArquivoEntity } from '../../../infrastructure/arquivo/entities/arquivo.entity';
import { CriteriosEntity } from './criterios.entity';
import { EntrevistaEntity } from './entrevista.entity';

@Entity('entrevista_match_criterio')
export class EntrevistaMatchCriterioEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  //

  @Column({ name: 'ativo', type: 'boolean' })
  ativo: boolean;

  @Column({ name: 'versao_mais_recente', type: 'boolean' })
  versaoMaisRecente!: boolean;

  @ManyToOne(() => ArquivoEntity)
  @JoinColumn({ name: 'arquivo_id' })
  arquivo?: ArquivoEntity | null;

  @ManyToOne(() => EntrevistaEntity, (entrevista) => entrevista.matchCriterios)
  @JoinColumn({ name: 'entrevista_id' })
  entrevista!: EntrevistaEntity;

  @Column({ name: 'entrevista_id' })
  entrevistaId: EntrevistaEntity['id'];

  @ManyToOne(() => CriteriosEntity, (criterio) => criterio.matchCriterios)
  @JoinColumn({ name: 'criterio_id' })
  criterio!: CriteriosEntity;

  //

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
