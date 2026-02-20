import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Repository } from 'typeorm';
import { LimparCpf } from '../../../helpers/functions/Mask';
import { AgendamentoEntity } from '../../agendamento/entities/agendamento.entity';
import { ReportAgendamentoDTO } from '../dtos/report-agendamento.dto';

@Injectable()
export class ReportAgendamentoService {
  constructor(
    @Inject('AGENDAMENTO_REPOSITORY')
    private readonly agendamentoRepository: Repository<AgendamentoEntity>,
  ) {}

  async execute(query: any) {
    try {
      const reportAgendamentoDTO = plainToClass(ReportAgendamentoDTO, query);
      await validateOrReject(reportAgendamentoDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const filter = await this.buildQueryBuilder(query);
    const entities = await filter.getMany();
    return await this.mapEntitiesToData(entities);
  }

  private async buildQueryBuilder(query: any) {
    const qb = this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.localAtendimento', 'localAtendimento')
      .leftJoinAndSelect('localAtendimento.endereco', 'endereco')
      .leftJoinAndSelect('endereco.cidade', 'cidade')
      .leftJoinAndSelect('cidade.estado', 'estado')
      .leftJoinAndSelect('localAtendimento.contato', 'contato')
      .leftJoinAndSelect('localAtendimento.secretariaMunicipal', 'secretariaMunicipal');
    
      if (query.localAtendimentoId) {
      qb.andWhere('agendamento.local_atendimento_id = :localAtendimentoId', {
        localAtendimentoId: query.localAtendimentoId,
      });
    } else if (query.secretariaMunicipalId) {

      qb.andWhere('secretariaMunicipal.id = :secretariaMunicipalId', {
        secretariaMunicipalId: query.secretariaMunicipalId,
      });
    }

    qb.andWhere('DATE(agendamento.data) BETWEEN :startDate AND :endDate', {
      startDate: query.startDate,
      endDate: query.endDate,
    });

    if (query.startTime) {
      qb.andWhere('agendamento.horario >= :startTime', {
        startTime: query.startTime,
      });
    }
    if (query.endTime) {
      qb.andWhere('agendamento.horario <= :endTime', {
        endTime: query.endTime,
      });
    }
    if (query.startDateBirth) {
      qb.andWhere('DATE(agendamento.data_nascimento) >= :startDateBirth', {
        startDateBirth: query.startDateBirth,
      });
    }
    if (query.endDateBirth) {
      qb.andWhere('DATE(agendamento.data_nascimento) <= :endDateBirth', {
        endDateBirth: query.endDateBirth,
      });
    }
    if (query.cpfChild) {
      query.cpfChild = LimparCpf(query.cpfChild);
      qb.andWhere('agendamento.cpf_crianca = :cpfChild', {
        cpfChild: query.cpfChild,
      });
    }

    switch (query.type) {
      case 'agendamento-por-periodo': {
        break;
      }
      case 'agendamento-atendido': {
        // qb.andWhere((qb) => {
        //   const subQuery = qb
        //     .subQuery()
        //     .select('crianca.cpf')
        //     .from('entrevista', 'entrevista')
        //     .innerJoin(
        //       'crianca',
        //       'crianca',
        //       'entrevista.crianca_id = crianca.id',
        //     )
        //     .where('crianca.cpf = agendamento.cpf_crianca')
        //     .getQuery();
        //   return 'agendamento.cpf_crianca IN ' + subQuery;
        // });

        // Como se pode ter agendamento mesmo após a entrevista, a lógica acima não é suficiente
        qb.andWhere("agendamento.status = 'finalizado'");
        break;
      }
      case 'agendamento-nao-atendido': {
        // qb.andWhere((qb) => {
        //   const subQuery = qb
        //     .subQuery()
        //     .select('crianca.cpf')
        //     .from('entrevista', 'entrevista')
        //     .innerJoin(
        //       'crianca',
        //       'crianca',
        //       'entrevista.crianca_id = crianca.id',
        //     )
        //     .where('crianca.cpf = agendamento.cpf_crianca')
        //     .getQuery();
        //   return 'agendamento.cpf_crianca NOT IN ' + subQuery;
        // });

        // Como se pode ter agendamento mesmo após a entrevista, a lógica acima não é suficiente
        qb.andWhere("agendamento.status != 'finalizado'");
        break;
      }
      default: {
        throw new BadRequestException(
          `Tipo de relatório inválido: ${query.type}`,
        );
      }
    }

    qb.orderBy('agendamento.data', 'ASC').addOrderBy(
      'agendamento.horario',
      'ASC',
    );

    return qb;
  }

  private async mapEntitiesToData(entities: AgendamentoEntity[]) {
    const data = entities.map(
      ({
        data,
        horario,
        cpfCrianca,
        nomeCrianca,
        dataNascimento,
        nomeRes,
        telefone,
        localAtendimento,
      }) => ({
        data,
        horario,
        cpf_crianca: cpfCrianca,
        nome_crianca: nomeCrianca,
        data_nascimento_crianca: dataNascimento,
        nome_responsavel: nomeRes,
        telefone_responsavel: telefone,
        local_atendimento: localAtendimento ? {
          id: localAtendimento.id,
          nome: localAtendimento.nome,
          endereco: localAtendimento.endereco ? {
            logradouro: localAtendimento.endereco.logradouro,
            numero: localAtendimento.endereco.numero,
            complemento: localAtendimento.endereco.complemento,
            bairro: localAtendimento.endereco.bairro,
            cep: localAtendimento.endereco.cep,
            cidade: localAtendimento.endereco.cidade?.nome,
            estado: localAtendimento.endereco.cidade?.estado?.nome,
          } : null,
          contato: localAtendimento.contato ? {
            telefones: localAtendimento.contato.telefones,
            emails: localAtendimento.contato.emails,
          } : null,
          secretaria_municipal: localAtendimento.secretariaMunicipal ? {
            id: localAtendimento.secretariaMunicipal.id,
            nome_fantasia: localAtendimento.secretariaMunicipal.nomeFantasia,
            razao_social: localAtendimento.secretariaMunicipal.razaoSocial,
            cnpj: localAtendimento.secretariaMunicipal.cnpj,
          } : null,
        } : null,
      }),
    );

    return { data, count: entities.length };
  }
}
