import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NivelAcesso } from './enums/pessoa.enum';

@Entity('usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('enum', { enum: NivelAcesso })
  nivelAcesso: NivelAcesso;

  @Column({ name: 'ativo', default: true })
  situacaoCadastral: boolean;

  @Column()
  usuario: string;

  @Column()
  senha: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
