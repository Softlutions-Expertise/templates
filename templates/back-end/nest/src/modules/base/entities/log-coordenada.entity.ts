import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsuarioEntity } from '../../pessoa/entities/usuario.entity';
import { Motivo, Servico } from './enums/log-coordenada.enum';

@Entity('base_log_coordenada')
export class LogCoordenadaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Servico })
  servico: Servico;

  @Column({ type: 'enum', enum: Motivo })
  motivo: Motivo;

  @Column()
  endereco: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @ManyToOne(() => UsuarioEntity, {
    eager: false,
  })
  usuario: UsuarioEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
