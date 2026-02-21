import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { SituacaoFuncionamento } from '../escola/entities/enums/escola.enum';
import { EscolaEntity } from '../escola/entities/escola.entity';
import { CriancaEntity } from '../pessoa/entities/crianca.entity';

@Injectable()
export class MapsService {
  constructor(
    @Inject('ESCOLA_REPOSITORY')
    private escolaRepository: Repository<EscolaEntity>,
    @Inject('CRIANCA_REPOSITORY')
    private criancaRepository: Repository<CriancaEntity>,
  ) { }

  async findAllEscolasByCidade(
    acessoControl: AcessoControl | null,
    idCidade: string,
    situacaoFuncionamento?: SituacaoFuncionamento,
  ): Promise<EscolaEntity[]> {
    await acessoControl.ensureCanReachTarget(
      'escola:read',
      this.escolaRepository.createQueryBuilder('escola'),
      null,
    );

    const query = this.escolaRepository
      .createQueryBuilder('escola')
      .leftJoinAndSelect('escola.secretariaMunicipal', 'secretariaMunicipal')
      .leftJoinAndSelect('escola.endereco', 'endereco')
      .leftJoinAndSelect('endereco.cidade', 'cidade')
      .leftJoinAndSelect('cidade.estado', 'estado')
      .leftJoinAndSelect('escola.contato', 'contato')
      .where('cidade.id = :idCidade', {
        idCidade,
      });

    if (situacaoFuncionamento) {
      query.andWhere('escola.situacaoFuncionamento = :situacaoFuncionamento', {
        situacaoFuncionamento,
      });
    }

    query.select([
      'escola.id',
      'escola.nomeFantasia',
      'escola.razaoSocial',
      'escola.cnpjEscola',
      'escola.situacaoFuncionamento',
      'secretariaMunicipal.id',
      'secretariaMunicipal.nomeFantasia',
      'secretariaMunicipal.razaoSocial',
      'secretariaMunicipal.cnpj',
      'endereco',
      'contato',
    ]);

    return query.getMany();
  }

  async findAllCriancaByCidade(
    acessoControl: AcessoControl,
    idCidade: string,
  ): Promise<any[]> {
    const qb = this.criancaRepository.createQueryBuilder('crianca');
    console.log('maps.service - findAllCriancaByCidade - created query builder', idCidade);

    await acessoControl.ensureCanReachTarget('crianca:read', qb, null);

    qb.leftJoinAndSelect('crianca.endereco', 'endereco')
      .leftJoinAndSelect('endereco.cidade', 'cidade')
      .where('cidade.id = :idCidade', { idCidade });

    qb.select([
      'crianca.id',
      'crianca.nome',
      'endereco',
    ]);

    qb.addSelect(
      `(
        SELECT e.status 
        FROM entrevista e 
        WHERE e.crianca_id = crianca.id 
        ORDER BY e.data_entrevista DESC, e.horario_agendamento DESC 
        LIMIT 1
      )`,
      'ultimaEntrevistaStatus'
    );

    const result = await qb.getRawAndEntities();

    return result.entities.map((crianca, index) => ({
      ...crianca,
      status: result.raw[index]?.ultimaEntrevistaStatus || null,
    }));
  }
}
