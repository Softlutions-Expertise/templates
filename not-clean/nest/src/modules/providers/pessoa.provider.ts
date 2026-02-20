import { DataSource } from 'typeorm';
import { PessoaEntity } from '../pessoa/entities/pessoa.entity';
import { FuncionarioEntity } from '../pessoa/entities/funcionario.entity';
import { UsuarioEntity } from '../pessoa/entities/usuario.entity';
import { CidadeEntity } from '../base/entities/cidade.entity';
import { ResponsavelEntity } from '../pessoa/entities/resposalvel.entity';
import { CriancaEntity } from '../pessoa/entities/crianca.entity';

export const pessoaProvider = [
  {
    provide: 'PESSOA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PessoaEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'RESPONSAVEL_CRIANCA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ResponsavelEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CRIANCA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CriancaEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'FUNCIONARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FuncionarioEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USUARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UsuarioEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CIDADE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CidadeEntity),
    inject: ['DATA_SOURCE'],
  },
];
