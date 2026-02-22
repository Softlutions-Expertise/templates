import { DataSource } from 'typeorm';
import { CidadeEntity } from '../base/entities/cidade.entity';
import { ColaboradorEntity } from '../pessoa/entities/colaborador.entity';
import { PessoaEntity } from '../pessoa/entities/pessoa.entity';
import { UsuarioEntity } from '../pessoa/entities/usuario.entity';

export const pessoaProvider = [
  {
    provide: 'PESSOA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PessoaEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'COLABORADOR_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ColaboradorEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USUARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UsuarioEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CIDADE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CidadeEntity),
    inject: ['DATA_SOURCE'],
  },
];
