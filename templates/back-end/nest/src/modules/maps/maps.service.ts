import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ColaboradorEntity } from '../pessoa/entities/colaborador.entity';

@Injectable()
export class MapsService {
  constructor(
    @Inject('COLABORADOR_REPOSITORY')
    private colaboradorRepository: Repository<ColaboradorEntity>,
  ) {}

  /**
   * Busca colaboradores com coordenadas para exibição no mapa
   */
  async findAllColaboradoresByCidade(
    acessoControl: AcessoControl | null,
    cidadeId: string,
  ): Promise<any[]> {
    const qb = this.colaboradorRepository.createQueryBuilder('colaborador');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'colaborador:read',
        qb,
      );
    }

    qb.leftJoinAndSelect('colaborador.pessoa', 'pessoa')
      .leftJoinAndSelect('pessoa.enderecos', 'endereco')
      .leftJoinAndSelect('endereco.cidade', 'cidade')
      .leftJoinAndSelect('pessoa.contato', 'contato')
      .where('cidade.id = :cidadeId', { cidadeId })
      .andWhere('endereco.latitude IS NOT NULL')
      .andWhere('endereco.longitude IS NOT NULL');

    qb.select([
      'colaborador.id',
      'colaborador.cargo',
      'colaborador.tipoVinculo',
      'colaborador.instituicaoNome',
      'pessoa.id',
      'pessoa.nome',
      'pessoa.dataNascimento',
      'endereco.id',
      'endereco.logradouro',
      'endereco.numero',
      'endereco.bairro',
      'endereco.latitude',
      'endereco.longitude',
      'cidade.id',
      'cidade.nome',
      'contato.id',
      'contato.telefones',
      'contato.emails',
    ]);

    const colaboradores = await qb.getMany();

    // Mapear para formato mais simples para o frontend
    return colaboradores.map((colaborador) => ({
      id: colaborador.id,
      nome: colaborador.pessoa?.nome,
      cargo: colaborador.cargo,
      tipoVinculo: colaborador.tipoVinculo,
      instituicaoNome: colaborador.instituicaoNome,
      dataNascimento: colaborador.pessoa?.dataNascimento,
      endereco: colaborador.pessoa?.enderecos?.[0]
        ? {
            id: colaborador.pessoa.enderecos[0].id,
            logradouro: colaborador.pessoa.enderecos[0].logradouro,
            numero: colaborador.pessoa.enderecos[0].numero,
            bairro: colaborador.pessoa.enderecos[0].bairro,
            latitude: colaborador.pessoa.enderecos[0].latitude,
            longitude: colaborador.pessoa.enderecos[0].longitude,
            cidade: colaborador.pessoa.enderecos[0].cidade?.nome,
          }
        : null,
      contato: colaborador.pessoa?.contato
        ? {
            telefones: colaborador.pessoa.contato.telefones,
            emails: colaborador.pessoa.contato.emails,
          }
        : null,
    }));
  }

  /**
   * Busca todos os colaboradores com coordenadas (sem filtro de cidade)
   */
  async findAllColaboradoresWithCoordinates(
    acessoControl: AcessoControl | null,
  ): Promise<any[]> {
    const qb = this.colaboradorRepository.createQueryBuilder('colaborador');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'colaborador:read',
        qb,
      );
    }

    qb.leftJoinAndSelect('colaborador.pessoa', 'pessoa')
      .leftJoinAndSelect('pessoa.enderecos', 'endereco')
      .leftJoinAndSelect('endereco.cidade', 'cidade')
      .leftJoinAndSelect('pessoa.contato', 'contato')
      .where('endereco.latitude IS NOT NULL')
      .andWhere('endereco.longitude IS NOT NULL');

    qb.select([
      'colaborador.id',
      'colaborador.cargo',
      'colaborador.tipoVinculo',
      'colaborador.instituicaoNome',
      'pessoa.id',
      'pessoa.nome',
      'pessoa.dataNascimento',
      'endereco.id',
      'endereco.logradouro',
      'endereco.numero',
      'endereco.bairro',
      'endereco.latitude',
      'endereco.longitude',
      'cidade.id',
      'cidade.nome',
      'contato.id',
      'contato.telefones',
      'contato.emails',
    ]);

    const colaboradores = await qb.getMany();

    return colaboradores.map((colaborador) => ({
      id: colaborador.id,
      nome: colaborador.pessoa?.nome,
      cargo: colaborador.cargo,
      tipoVinculo: colaborador.tipoVinculo,
      instituicaoNome: colaborador.instituicaoNome,
      dataNascimento: colaborador.pessoa?.dataNascimento,
      endereco: colaborador.pessoa?.enderecos?.[0]
        ? {
            id: colaborador.pessoa.enderecos[0].id,
            logradouro: colaborador.pessoa.enderecos[0].logradouro,
            numero: colaborador.pessoa.enderecos[0].numero,
            bairro: colaborador.pessoa.enderecos[0].bairro,
            latitude: colaborador.pessoa.enderecos[0].latitude,
            longitude: colaborador.pessoa.enderecos[0].longitude,
            cidade: colaborador.pessoa.enderecos[0].cidade?.nome,
          }
        : null,
      contato: colaborador.pessoa?.contato
        ? {
            telefones: colaborador.pessoa.contato.telefones,
            emails: colaborador.pessoa.contato.emails,
          }
        : null,
    }));
  }
}
