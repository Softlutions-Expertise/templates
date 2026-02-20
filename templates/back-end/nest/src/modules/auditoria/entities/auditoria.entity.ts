import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum TipoAcao {
  LOGIN = 'login',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Entity('auditorias')
@Index(['usuarioId'])
@Index(['acao'])
@Index(['createdAt'])
export class Auditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  usuarioId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  usuarioEmail: string | null;

  @Column({ type: 'enum', enum: TipoAcao })
  acao: TipoAcao;

  @Column({ type: 'varchar', length: 100 })
  entidade: string;

  @Column({ type: 'uuid', nullable: true })
  entidadeId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  dadosAnteriores: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  dadosNovos: Record<string, any> | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descricao: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ type: 'text', nullable: true })
  jwtToken: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
