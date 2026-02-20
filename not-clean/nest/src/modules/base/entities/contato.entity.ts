import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Telefones, Emails } from './enums/contato.enum';

@Entity('base_contato')
export class ContatoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('simple-array', {
    transformer: {
      to: (value) => JSON.stringify(value),
      from: (value) => JSON.parse(value),
    },
  })
  telefones!: Telefones[];

  @Column('simple-array', {
    transformer: {
      to: (value) => JSON.stringify(value),
      from: (value) => JSON.parse(value),
    },
  })
  emails: Emails[];
}
