import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CriteriosEntity } from '../../entrevista/entities/criterios.entity';
import { CriteriosConfiguracaoEntity } from './criterios-configuracao.entity';

export enum CriterioConfiguracaoNotaTecnica {
  DEFINIDO = 'DEFINIDO',
  TIPO_C = 'C',
  TIPO_H = 'H',
}

@Entity('criterios_configuracao_criterio')
export class CriteriosConfiguracaoCriterioEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'nota_tecnica', type: 'text' })
  notaTecnica!: CriterioConfiguracaoNotaTecnica;

  @Column({ name: 'posicao', type: 'int' })
  posicao!: number;

  @Column({ name: 'sub_posicao', type: 'int' })
  subPosicao!: number;

  @Column({ name: 'exigir_comprovacao', type: 'bool' })
  exigirComprovacao!: boolean;

  @ManyToOne(() => CriteriosEntity)
  @JoinColumn({ name: 'criterio_id' })
  criterio!: CriteriosEntity;

  @ManyToOne(
    () => CriteriosConfiguracaoEntity,
    (configuracaoCriterios) =>
      configuracaoCriterios.criteriosConfiguracaoCriterio,
  )
  @JoinColumn({ name: 'criterios_configuracao_id' })
  criteriosConfiguracao!: CriteriosConfiguracaoEntity;

  @Column({ name: 'criterios_configuracao_id' })
  criteriosConfiguracaoId: CriteriosConfiguracaoEntity['id'];
}
