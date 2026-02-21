import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estado')
export class EstadoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  uf!: string;
}
