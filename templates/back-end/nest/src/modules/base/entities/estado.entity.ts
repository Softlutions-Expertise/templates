import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('base_estado')
export class EstadoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  uf!: string;
}
