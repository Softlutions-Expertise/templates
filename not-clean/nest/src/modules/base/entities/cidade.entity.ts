import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EnderecoEntity } from './endereco.entity';
import { EstadoEntity } from './estado.entity';

@Entity('cidade')
export class CidadeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @ManyToOne(() => EstadoEntity, { eager: false })
  @JoinColumn({ name: 'estado_id', referencedColumnName: 'id' })
  estado!: EstadoEntity;

  @OneToMany(() => EnderecoEntity, (endereco) => endereco.cidade, {
    eager: false,
  })
  enderecos!: EnderecoEntity[];
}
