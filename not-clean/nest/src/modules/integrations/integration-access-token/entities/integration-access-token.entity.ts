import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FuncionarioEntity } from '../../../pessoa/entities/funcionario.entity';

@Entity('integration_access_token')
export class IntegrationAccessTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'timestamptz' })
  validoAte: Date | null;

  @Column({ type: 'boolean' })
  ativo: boolean;

  //

  @ManyToOne(() => FuncionarioEntity, { nullable: false })
  @JoinColumn({ name: 'id_funcionario_autor_fk' })
  funcionarioAutor: FuncionarioEntity;

  @ManyToOne(() => FuncionarioEntity, { nullable: true })
  @JoinColumn({ name: 'id_herda_permissoes_de_funcionario_fk' })
  herdaPermissoesDeFuncionario: FuncionarioEntity | null;

  //

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
