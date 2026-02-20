import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('distrito')
export class DistritoEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  nome!: string;
}
