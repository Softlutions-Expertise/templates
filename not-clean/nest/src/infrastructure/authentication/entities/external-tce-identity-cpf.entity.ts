import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('external_tce_identity_cpf')
export class ExternalTceIdentityCpfEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'sub', type: 'text' })
  sub!: string;

  @Column({ name: 'cpf', type: 'text' })
  cpf!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
