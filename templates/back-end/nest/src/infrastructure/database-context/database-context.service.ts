import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CidadeEntity } from '../../modules/base/entities/cidade.entity';
import { ContatoEntity } from '../../modules/base/entities/contato.entity';
import { EnderecoEntity } from '../../modules/base/entities/endereco.entity';
import { EstadoEntity } from '../../modules/base/entities/estado.entity';
import { LogCoordenadaEntity } from '../../modules/base/entities/log-coordenada.entity';
import { ColaboradorEntity } from '../../modules/pessoa/entities/colaborador.entity';
import { PessoaEntity } from '../../modules/pessoa/entities/pessoa.entity';
import { UsuarioEntity } from '../../modules/pessoa/entities/usuario.entity';
import { ArquivoEntity } from '../arquivo/entities/arquivo.entity';
import { ExternalTceIdentityCpfEntity } from '../authentication/entities/external-tce-identity-cpf.entity';

@Injectable()
export class DatabaseContextService {
  constructor(
    @Inject('DATA_SOURCE')
    readonly dataSource: DataSource,
  ) {}

  async getDbStats() {
    const tz = await this.dataSource
      .query('show timezone')
      .then((out) => out?.[0]?.TimeZone ?? out)
      .catch(() => 'err');

    const dt = await this.dataSource
      .query(
        `SELECT NOW(), CURRENT_TIMESTAMP, LOCALTIME,  LOCALTIMESTAMP, transaction_timestamp(), statement_timestamp(), clock_timestamp(), timeofday()`,
      )
      .then((out) => out?.[0] ?? out)
      .catch(() => 'err');

    return {
      tz,
      dt,
    };
  }

  // Base repositories
  get estadoRepository() {
    return this.dataSource.getRepository(EstadoEntity);
  }

  get cidadeRepository() {
    return this.dataSource.getRepository(CidadeEntity);
  }

  get enderecoRepository() {
    return this.dataSource.getRepository(EnderecoEntity);
  }

  get contatoRepository() {
    return this.dataSource.getRepository(ContatoEntity);
  }

  get logCoordenadaRepository() {
    return this.dataSource.getRepository(LogCoordenadaEntity);
  }

  // Pessoa repositories
  get pessoaRepository() {
    return this.dataSource.getRepository(PessoaEntity);
  }

  get colaboradorRepository() {
    return this.dataSource.getRepository(ColaboradorEntity);
  }

  get usuarioRepository() {
    return this.dataSource.getRepository(UsuarioEntity);
  }

  // Infrastructure repositories
  get arquivoRepository() {
    return this.dataSource.getRepository(ArquivoEntity);
  }

  get externalTceIdentityCpf() {
    return this.dataSource
      .getRepository(ExternalTceIdentityCpfEntity)
      .extend({});
  }
}
