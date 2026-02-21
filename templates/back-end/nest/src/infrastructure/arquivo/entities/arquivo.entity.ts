import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('arquivo')
export class ArquivoEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  //

  @Column({ name: 'access_token', type: 'text' })
  accessToken: string | null;

  @Column({ name: 'nome_arquivo', type: 'text' })
  nomeArquivo: string | null;

  @Column({ name: 'tipo_arquivo', type: 'text' })
  tipoArquivo: string | null;

  @Column({ name: 'name_size_file', type: 'text' })
  nameSizeFile: string | null;

  @Column({ name: 'byte_string', type: 'text' })
  byteString: string | null;
}
