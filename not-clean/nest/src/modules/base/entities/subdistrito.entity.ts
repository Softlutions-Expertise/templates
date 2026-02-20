import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('subdistrito')
export class SubdistritoEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  nome!: string;
}
