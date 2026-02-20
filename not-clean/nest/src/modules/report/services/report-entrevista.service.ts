import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Repository } from 'typeorm';
import { EntrevistaStatusEnum } from '../../entrevista/dto/enums/entrevista-status-enum';
import { EntrevistaEntity } from '../../entrevista/entities/entrevista.entity';
import { ReservaVagaStatusEnum } from '../../reserva-vaga/enums/reserva-vaga-status.enum';
import { ReportEntrevistaDTO } from '../dtos/report-entrevista.dto';

@Injectable()
export class ReportEntrevistaService {
  constructor(
    @Inject('ENTREVISTA_REPOSITORY')
    private readonly entrevistaRepository: Repository<EntrevistaEntity>,
  ) { }

  async execute(query: any) {
    try {
      const reportEntrevistaDTO = plainToClass(ReportEntrevistaDTO, query);
      await validateOrReject(reportEntrevistaDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const filter = await this.buildQueryBuilder(query);
    const entities = await filter.getMany();

    return await this.mapEntitiesToData(entities, query);
  }

  private async buildQueryBuilder(query: any) {
    const qb = this.entrevistaRepository.createQueryBuilder('entrevista');
    qb.groupBy('entrevista.id');

    qb.leftJoin('entrevista.secretariaMunicipal', 'secretaria_municipal');
    qb.addSelect([
      'secretaria_municipal.id',
      'secretaria_municipal.nomeFantasia',
    ]);
    qb.addGroupBy('secretaria_municipal.id');
    qb.andWhere('secretaria_municipal.id = :secretariaMunicipalId', {
      secretariaMunicipalId: query.secretariaMunicipalId,
    });

    qb.leftJoin('entrevista.entrevistador', 'entrevistador');
    qb.addSelect(['entrevistador.id']);
    qb.addGroupBy('entrevistador.id');
    if (query.entrevistadorId) {
      qb.andWhere('entrevistador.id = :entrevistadorId', {
        entrevistadorId: query.entrevistadorId,
      });
    }
    qb.leftJoin('entrevistador.pessoa', 'entrevistador_pessoa');
    qb.addSelect(['entrevistador_pessoa.nome']);
    qb.addGroupBy('entrevistador_pessoa.id');

    if (query.startDate) {
      qb.andWhere('DATE(entrevista.dataEntrevista) >= :startDate', {
        startDate: query.startDate,
      });
    }
    if (query.endDate) {
      qb.andWhere('DATE(entrevista.dataEntrevista) <= :endDate', {
        endDate: query.endDate,
      });
    }

    if (query.startTime) {
      qb.andWhere('entrevista.horarioEntrevista >= :startTime', {
        startTime: query.startTime,
      });
    }
    if (query.endTime) {
      qb.andWhere('entrevista.horarioEntrevista <= :endTime', {
        endTime: query.endTime,
      });
    }

    if (query.responsibleType) {
      qb.andWhere('entrevista.tipoResponsavel = :responsibleType', {
        responsibleType: query.responsibleType,
      });
    }

    if (query.year) {
      qb.andWhere('entrevista.anoLetivo = :year', {
        year: query.year,
      });
    }

    qb.leftJoin('entrevista.preferenciaUnidade', 'preferenciaUnidade');
    qb.addSelect(['preferenciaUnidade.id', 'preferenciaUnidade.nomeFantasia']);
    qb.addGroupBy('preferenciaUnidade.id');
    qb.leftJoin('entrevista.preferenciaUnidade2', 'preferenciaUnidade2');
    qb.addSelect([
      'preferenciaUnidade2.id',
      'preferenciaUnidade2.nomeFantasia',
    ]);
    qb.addGroupBy('preferenciaUnidade2.id');
    if (query.unidadeEscolarId) {
      qb.andWhere(
        '(preferenciaUnidade.id = :unidadeEscolarId OR preferenciaUnidade2.id = :unidadeEscolarId)',
        { unidadeEscolarId: query.unidadeEscolarId },
      );
    }

    qb.leftJoin('entrevista.etapa', 'etapa');
    qb.addSelect(['etapa.id', 'etapa.nome']);
    qb.addGroupBy('etapa.id');

    qb.leftJoin(
      'etapa.secretariaMunicipalEtapas',
      'sme',
      'sme.secretariaMunicipal = secretaria_municipal.id AND sme.ativa = true',
    );
    qb.addSelect([
      'sme.id',
      'sme.apelido',
      'sme.idadeInicial',
      'sme.idadeFinal',
    ]);
    qb.addGroupBy('sme.id');
    qb.addGroupBy('sme.apelido');
    qb.addGroupBy('sme.idadeInicial');
    qb.addGroupBy('sme.idadeFinal');

    if (query.etapaId) {
      qb.andWhere('etapa.id = :etapaId', { etapaId: query.etapaId });
    }

    if (query.turn) {
      qb.andWhere(
        '(entrevista.preferenciaTurno = :turn OR entrevista.preferenciaTurno2 = :turn)',
        {
          turn: query.turn,
        },
      );
    }

    if (query.brotherSchool) {
      qb.andWhere('entrevista.possuiIrmaoNaUnidade = :brotherSchool', {
        brotherSchool: query.brotherSchool,
      });
    }
    qb.leftJoin('entrevista.unidadeEscolarIrmao', 'unidadeEscolarIrmao');
    qb.addSelect([
      'unidadeEscolarIrmao.id',
      'unidadeEscolarIrmao.nomeFantasia',
    ]);
    qb.addGroupBy('unidadeEscolarIrmao.id');

    if (query.startMembersAddress) {
      qb.andWhere('entrevista.membrosEderecoCrianca >= :startMembersAddress', {
        startMembersAddress: query.startMembersAddress,
      });
    }
    if (query.endMembersAddress) {
      qb.andWhere('entrevista.membrosEderecoCrianca <= :endMembersAddress', {
        endMembersAddress: query.endMembersAddress,
      });
    }

    if (query.startMembersFamilyIncome) {
      qb.andWhere(
        'entrevista.membrosContribuintesRenda >= :startMembersFamilyIncome',
        { startMembersFamilyIncome: query.startMembersFamilyIncome },
      );
    }
    if (query.endMembersFamilyIncome) {
      qb.andWhere(
        'entrevista.membrosContribuintesRenda <= :endMembersFamilyIncome',
        { endMembersFamilyIncome: query.endMembersFamilyIncome },
      );
    }

    if (query.startFamilyIncome) {
      qb.andWhere('entrevista.valorRendaFamiliar >= :startFamilyIncome', {
        startFamilyIncome: query.startFamilyIncome,
      });
    }
    if (query.endFamilyIncome) {
      qb.andWhere('entrevista.valorRendaFamiliar <= :endFamilyIncome', {
        endFamilyIncome: query.endFamilyIncome,
      });
    }

    qb.leftJoin(
      'entrevista.reservaVaga',
      'reservaVaga',
      'reservaVaga.entrevista_id = entrevista.id',
    );
    qb.addSelect([
      'reservaVaga.id',
      'reservaVaga.status',
      'reservaVaga.codigoReservaVaga',
    ]);

    qb.addGroupBy('reservaVaga.id');

    if (query.vacancy) {
      switch (query.vacancy) {
        case 'Todos':
          break;
        case 'Aguardando Vaga':
          qb.andWhere('reservaVaga.id IS NULL');

          if (query.situation) {
            switch (query.situation) {
              case 'Todos':
                break;
              case 'Elegível Para Fila':
                qb.andWhere(
                  '(entrevista.elegivelParaFila = true) OR (entrevista.elegivelParaFila2 = true)',
                );
                break;
              case 'Fora da Fila de Espera':
                qb.andWhere(
                  '(entrevista.elegivelParaFila = false) AND (entrevista.elegivelParaFila2 = false)',
                );
                break;
              case 'Aguardando Transferência':
                qb.andWhere('entrevista.status = :status', {
                  status: EntrevistaStatusEnum.TRANSFERENCIA,
                });
            }
          }
          break;
        case 'Vaga Concedida':
          qb.andWhere('reservaVaga.id IS NOT NULL');
          if (query.situation) {
            switch (query.situation) {
              case 'Todos':
                break;
              case 'Transferida':
                qb.andWhere('reservaVaga.status = :status', {
                  status: ReservaVagaStatusEnum.TRANSFERIDA,
                });
            }
          }
          break;
      }
    }

    // critérios da secretaria municipal
    qb.leftJoin(
      'secretaria_municipal.configuracoesCriterios',
      'configuracoes_criterios',
      'configuracoes_criterios.secretariaMunicipal = secretaria_municipal.id AND data_vigencia_fim IS NULL',
    );
    qb.addSelect(['configuracoes_criterios.id']);
    qb.addGroupBy('configuracoes_criterios.id');

    qb.leftJoin(
      'configuracoes_criterios.criteriosConfiguracaoCriterio',
      'criterios_configuracao_criterio',
      'criterios_configuracao_criterio.criteriosConfiguracaoId = configuracoes_criterios.id',
    );
    qb.addSelect([
      'criterios_configuracao_criterio.id',
      'criterios_configuracao_criterio.posicao',
      'criterios_configuracao_criterio.subPosicao',
      'criterios_configuracao_criterio.exigirComprovacao',
    ]);
    qb.addGroupBy('criterios_configuracao_criterio.id');
    qb.addOrderBy('criterios_configuracao_criterio.posicao', 'ASC');
    qb.addOrderBy('criterios_configuracao_criterio.subPosicao', 'ASC');

    qb.leftJoin(
      'criterios_configuracao_criterio.criterio',
      'criterio',
      'criterio.id = criterios_configuracao_criterio.criterio_id',
    );
    qb.addSelect(['criterio.id', 'criterio.nome']);
    qb.addGroupBy('criterio.id');

    // critérios da entrevista
    qb.leftJoin(
      'entrevista.matchCriterios',
      'match_criterios',
      '(match_criterios.id is null) OR (match_criterios.ativo = TRUE AND match_criterios.versaoMaisRecente = true)',
    );
    qb.addSelect(['match_criterios.id']);
    qb.addGroupBy('match_criterios.id');

    qb.leftJoin('match_criterios.criterio', 'criterio_match');
    qb.addSelect(['criterio_match.id']);
    qb.addGroupBy('criterio_match.id');

    if (query.filterPreferredGroups && query.preferredGroups) {
      const preferredGroups = query.preferredGroups.split(',');

      switch (query.filterPreferredGroups) {
        case 'Possui ao menos 1 da seleção':
          qb.andWhere(
            'entrevista.id IN (SELECT e.id FROM entrevista e LEFT JOIN entrevista_match_criterio mc ON mc.entrevista_id = e.id WHERE mc.ativo = true AND mc.versao_mais_recente = true AND mc.criterio_id IN (:...preferredGroups))',
            { preferredGroups },
          );
          break;

        case 'Possui todos da seleção':
          qb.andWhere(
            'entrevista.id IN (SELECT e.id FROM entrevista e LEFT JOIN entrevista_match_criterio mc ON mc.entrevista_id = e.id WHERE mc.ativo = true AND mc.versao_mais_recente = true AND mc.criterio_id IN (:...preferredGroups) GROUP BY e.id HAVING COUNT(DISTINCT mc.criterio_id) = :totalCriteria)',
            { preferredGroups, totalCriteria: preferredGroups.length },
          );
          break;
      }
    }

    qb.leftJoin('entrevista.crianca', 'crianca');
    qb.addSelect(['crianca.id', 'crianca.nome', 'crianca.cpf']);
    qb.addGroupBy('crianca.id');

    return qb;
  }

  private mapEntrevistaData(entity: EntrevistaEntity) {
    const sme = entity.etapa?.secretariaMunicipalEtapas?.[0];

    return {
      crianca: {
        id: entity.crianca?.id,
        nome: entity.crianca?.nome,
        cpf: entity.crianca?.cpf,
      },
      responsavel: {
        tipo: entity.tipoResponsavel,
        nome: entity.nomeResponsavel,
        cpf: entity.cpfResponsavel,
      },
      entrevistador: {
        id: entity.entrevistador?.id,
        nome: entity.entrevistador?.pessoa?.nome,
        cpf: entity.entrevistador?.pessoa?.cpf,
      },
      ano_letivo: entity.anoLetivo,
      data_entrevista: entity.dataEntrevista,
      horario_entrevista: entity.horarioEntrevista,
      preferencia_unidade: {
        id: entity.preferenciaUnidade?.id,
        nome_fantasia: entity.preferenciaUnidade?.nomeFantasia,
        irmao_unidade:
          entity.unidadeEscolarIrmao?.id && entity.preferenciaUnidade?.id
            ? entity.unidadeEscolarIrmao.id === entity.preferenciaUnidade.id
            : false,
        elegivel_para_fila: entity.elegivelParaFila,
      },
      preferencia_unidade2: {
        id: entity.preferenciaUnidade2?.id,
        nome_fantasia: entity.preferenciaUnidade2?.nomeFantasia,
        irmao_unidade:
          entity.unidadeEscolarIrmao?.id && entity.preferenciaUnidade2?.id
            ? entity.unidadeEscolarIrmao.id === entity.preferenciaUnidade2.id
            : false,
        elegivel_para_fila: entity.elegivelParaFila2,
      },
      etapa: entity.etapa?.nome,
      apelido: sme?.apelido,
      preferencia_turno: entity.preferenciaTurno,
      preferencia_turno2: entity.preferenciaTurno2,
      membros_endereco: entity.membrosEderecoCrianca,
      membros_contribuintes_renda: entity.membrosContribuintesRenda,
      valor_renda_familiar: entity.valorRendaFamiliar,
      situacao: entity.reservaVaga?.id ? 'Vaga Concedida' : 'Aguardando Vaga',
      elegivelParaFila:
        entity.elegivelParaFila || entity.elegivelParaFila2
          ? 'Elegível Para Fila'
          : 'Fora da Fila de Espera',
    };
  }

  private mapGruposPreferenciais(secretariaMunicipal: any) {
    if (
      !secretariaMunicipal?.configuracoesCriterios ||
      !Array.isArray(secretariaMunicipal.configuracoesCriterios)
    ) {
      return [];
    }

    return secretariaMunicipal.configuracoesCriterios.flatMap((criterio) => {
      if (
        !criterio?.criteriosConfiguracaoCriterio ||
        !Array.isArray(criterio.criteriosConfiguracaoCriterio)
      ) {
        return [];
      }

      return criterio.criteriosConfiguracaoCriterio.map((configCriterio) => ({
        posicao: configCriterio?.posicao,
        subPosicao: configCriterio?.subPosicao,
        exigirComprovacao: configCriterio?.exigirComprovacao,
        criterio: configCriterio?.criterio?.nome,
      }));
    });
  }

  private mapCriterios(entity: EntrevistaEntity) {
    const { matchCriterios, secretariaMunicipal } = entity;

    if (
      !Array.isArray(matchCriterios) ||
      !secretariaMunicipal?.configuracoesCriterios ||
      !Array.isArray(secretariaMunicipal.configuracoesCriterios)
    ) {
      return [];
    }

    return matchCriterios
      .map((matchCriterio) => {
        if (!matchCriterio?.criterio?.id) return null;

        const configCriterio = secretariaMunicipal.configuracoesCriterios
          .flatMap((criterio) => {
            if (
              !criterio?.criteriosConfiguracaoCriterio ||
              !Array.isArray(criterio.criteriosConfiguracaoCriterio)
            ) {
              return [];
            }
            return criterio.criteriosConfiguracaoCriterio;
          })
          .find((config) => config?.criterio?.id === matchCriterio.criterio.id);

        return configCriterio
          ? {
            posicao: configCriterio.posicao,
            subPosicao: configCriterio.subPosicao,
          }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) =>
        a.posicao === b.posicao
          ? a.subPosicao - b.subPosicao
          : a.posicao - b.posicao,
      );
  }

  private async getAllEtapasLegend(secretariaMunicipalId: string) {
    const smes = await this.entrevistaRepository
      .createQueryBuilder()
      .select('etapa.nome', 'nome')
      .addSelect('sme.apelido', 'apelido')
      .addSelect('sme.idadeInicial', 'idade_inicial')
      .addSelect('sme.idadeFinal', 'idade_final')
      .from('secretaria_municipal_etapa', 'sme')
      .innerJoin('etapa', 'etapa', 'etapa.id = sme.etapa_id')
      .where('sme.secretaria_municipal_id = :secretariaMunicipalId', {
        secretariaMunicipalId,
      })
      .andWhere('sme.ativa = true')
      .groupBy('etapa.nome, sme.apelido, sme.idadeInicial, sme.idadeFinal')
      .orderBy('etapa.nome', 'ASC')
      .getRawMany();

    return smes;
  }

  private async mapEntitiesToData(entities: EntrevistaEntity[], query: any) {
    const allEtapasLegend = await this.getAllEtapasLegend(
      query.secretariaMunicipalId,
    );

    const groupedData = entities.reduce((acc, entity) => {
      const anoLetivo = entity.anoLetivo;
      const secretariaNome = entity.secretariaMunicipal?.nomeFantasia;

      if (!anoLetivo || !secretariaNome) {
        return acc;
      }

      acc[anoLetivo] ??= {};
      acc[anoLetivo][secretariaNome] ??= {
        criterios: [],
        grupos_preferenciais: this.mapGruposPreferenciais(
          entity.secretariaMunicipal,
        ),
        etapas: allEtapasLegend,
        entrevistas: [],
      };

      acc[anoLetivo][secretariaNome].entrevistas.push({
        ...this.mapEntrevistaData(entity),
        criterios: this.mapCriterios(entity),
      });

      return acc;
    }, {});

    return {
      data: Object.entries(groupedData).map(([year, secretarias]) => ({
        year,
        secretarias: Object.entries(secretarias).map(([secretaria, data]) => ({
          secretaria,
          grupos_preferenciais: data.grupos_preferenciais,
          etapas: data.etapas,
          entrevistas: data.entrevistas,
        })),
      })),
      count: entities.length,
    };
  }
}
