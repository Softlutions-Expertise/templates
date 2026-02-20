import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { CriteriosConfiguracaoEntity } from '../../configuracao-criterio/entities/criterios-configuracao.entity';
import { EntrevistaMatchCriterioEntity } from '../../entrevista/entities/etrevista_match_criterio.entity';
import { FilaGeradaPosicaoEntity } from './fila-gerada-posicao.entity';
import { FilaGeradaEntity } from './fila-gerada.entity';

@Entity('fila_gerada_posicao_has_entrevista_match_criterio')
export class FilaGeradaPosicaoHasEntrevistaMatchCriterioEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  //

  @ManyToOne(() => CriteriosConfiguracaoEntity)
  @JoinColumn({ name: 'fila_gerada_posicao_id', referencedColumnName: 'id' })
  filaGeradaPosicao!: FilaGeradaPosicaoEntity;

  @ManyToOne(() => FilaGeradaEntity)
  @JoinColumn({ name: 'entrevista_match_criterio_id', referencedColumnName: 'id' })
  entrevistaMatchCriterio!: EntrevistaMatchCriterioEntity;

  //

}
