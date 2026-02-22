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
import { ColaboradorEntity } from '../../../pessoa/entities/colaborador.entity';

@Entity('integration_access_token')
export class IntegrationAccessTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  token!: string;

  @Column({ nullable: true })
  descricao!: string;

  @Column({ default: true })
  ativo!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  validoAte!: Date;

  @ManyToOne(() => ColaboradorEntity, { nullable: false })
  @JoinColumn({ name: 'colaborador_autor_id' })
  colaboradorAutor: ColaboradorEntity;

  @ManyToOne(() => ColaboradorEntity, { nullable: true })
  @JoinColumn({ name: 'herda_permissoes_de_colaborador_id' })
  herdaPermissoesDeColaborador: ColaboradorEntity | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  /**
   * @deprecated Use colaboradorAutor instead
   */
  get funcionarioAutor(): ColaboradorEntity {
    return this.colaboradorAutor;
  }

  /**
   * @deprecated Use herdaPermissoesDeColaborador instead
   */
  get herdaPermissoesDeFuncionario(): ColaboradorEntity | null {
    return this.herdaPermissoesDeColaborador;
  }
}
