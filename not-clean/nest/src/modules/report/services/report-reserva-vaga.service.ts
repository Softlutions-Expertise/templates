import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Repository } from 'typeorm';
import { ReservaVagaEntity } from '../../reserva-vaga/entities/reserva-vaga.entity';
import { ReportReservaVagaDTO } from '../dtos/report-reserva-vaga.dto';

@Injectable()
export class ReportReservaVagaService {
  constructor(
    @Inject('RESERVA_VAGA_REPOSITORY')
    private reservaVagaRepository: Repository<ReservaVagaEntity>,
  ) {}

  async execute(query: any) {
    try {
      const reportReservaVagaDTO = plainToClass(ReportReservaVagaDTO, query);
      await validateOrReject(reportReservaVagaDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const filter = await this.buildQueryBuilder(query);
    const entities = await filter.getMany();

    return await this.mapEntitiesToData(entities, query);
  }

  private async buildQueryBuilder(query: any) {
    const qb = this.reservaVagaRepository.createQueryBuilder('reserva_vaga');

    qb.orderBy();

    qb.leftJoin('reserva_vaga.vaga', 'vaga');
    qb.addSelect(['vaga.id', 'vaga.anoLetivo', 'vaga.turma_id']);

    qb.leftJoin('vaga.turma', 'turma');
    qb.addSelect(['turma.id', 'turma.nome', 'turma.turno', 'turma.etapa_id']);

    qb.leftJoin('turma.etapa', 'etapa');
    qb.addSelect(['etapa.id', 'etapa.nome']);

    qb.leftJoin('vaga.escola', 'escola');
    qb.addSelect(['escola.id', 'escola.nomeFantasia']);

    qb.leftJoin('escola.secretariaMunicipal', 'secretaria_municipal');
    qb.addSelect([
      'secretaria_municipal.id',
      'secretaria_municipal.nomeFantasia',
    ]);

    qb.where('secretaria_municipal.id = :secretariaMunicipalId', {
      secretariaMunicipalId: query.secretariaMunicipalId,
    });

    qb.andWhere('vaga.anoLetivo = :year', { year: query.year });

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

    if (query.status) {
      qb.andWhere('reserva_vaga.status = :status', { status: query.status });
    }

    if (query.unidadeEscolarId) {
      qb.andWhere('vaga.escola_id = :unidadeEscolarId', {
        unidadeEscolarId: query.unidadeEscolarId,
      });
    }

    if (query.etapaId) {
      qb.andWhere('turma.etapa_id = :etapaId', { etapaId: query.etapaId });
    }

    if (query.turn) {
      qb.andWhere('turma.turno = :turn', { turn: query.turn });
    }

    if (query.turmaId) {
      qb.andWhere('vaga.turma_id = :turmaId', { turmaId: query.turmaId });
    }

    if (query.startDateOccupation) {
      qb.andWhere('DATE(reserva_vaga.createdAt) >= :startDateOccupation', {
        startDateOccupation: query.startDateOccupation,
      });
    }

    if (query.endDateOccupation) {
      qb.andWhere('DATE(reserva_vaga.createdAt) <= :endDateOccupation', {
        endDateOccupation: query.endDateOccupation,
      });
    }

    if (query.startDateReference) {
      qb.andWhere('DATE(reserva_vaga.dataReferencia) >= :startDateReference', {
        startDateReference: query.startDateReference,
      });
    }

    if (query.endDateReference) {
      qb.andWhere('DATE(reserva_vaga.dataReferencia) <= :endDateReference', {
        endDateReference: query.endDateReference,
      });
    }

    if (query.viewPreferredGroups === 'true') {
      // critérios da secretaria municipal
      qb.leftJoin(
        'secretaria_municipal.configuracoesCriterios',
        'configuracoes_criterios',
        'configuracoes_criterios.secretariaMunicipal = secretaria_municipal.id AND data_vigencia_fim IS NULL',
      );
      qb.addSelect(['configuracoes_criterios.id']);
      // qb.addGroupBy('configuracoes_criterios.id');

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
      // qb.addGroupBy('criterios_configuracao_criterio.id');
      qb.addOrderBy('criterios_configuracao_criterio.posicao', 'ASC');
      qb.addOrderBy('criterios_configuracao_criterio.subPosicao', 'ASC');

      qb.leftJoin(
        'criterios_configuracao_criterio.criterio',
        'criterio',
        'criterio.id = criterios_configuracao_criterio.criterio_id',
      );
      qb.addSelect(['criterio.id', 'criterio.nome']);
      // qb.addGroupBy('criterio.id');

      // critérios da entrevista
      qb.leftJoin('reserva_vaga.entrevista', 'entrevista');
      qb.addSelect(['entrevista.id']);
      // qb.addGroupBy('entrevista.id');

      qb.leftJoin(
        'entrevista.matchCriterios',
        'match_criterios',
        '(match_criterios.id is null) OR (match_criterios.ativo = TRUE AND match_criterios.versaoMaisRecente = true)',
      );
      qb.addSelect(['match_criterios.id']);
      // qb.addGroupBy('match_criterios.id');

      qb.leftJoin('match_criterios.criterio', 'criterio_match');
      qb.addSelect(['criterio_match.id']);
      // qb.addGroupBy('criterio_match.id');
    }

    qb.leftJoin('reserva_vaga.crianca', 'crianca');
    qb.addSelect([
      'crianca.id',
      'crianca.nome',
      'crianca.cpf',
      'crianca.dataNascimento',
    ]);

    qb.leftJoin('crianca.responsavel', 'responsavel');
    qb.addSelect(['responsavel.id', 'responsavel.nomeRes']);

    qb.leftJoin('crianca.responsavel2', 'responsavel2');
    qb.addSelect(['responsavel2.id', 'responsavel2.nomeRes']);

    qb.leftJoin('reserva_vaga.funcionario', 'funcionario');
    qb.addSelect(['funcionario.id']);

    qb.leftJoin('funcionario.pessoa', 'pessoa');
    qb.addSelect(['pessoa.id', 'pessoa.nome']);

    return qb;
  }

  private async getAllEtapasLegend(secretariaMunicipalId: string) {
    const smes = await this.reservaVagaRepository
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

  private mapReservaVagaData(entity: ReservaVagaEntity) {
    const sme = entity.vaga?.turma?.etapa?.secretariaMunicipalEtapas?.[0];

    return {
      data_reserva_vaga: entity.createdAt,
      codigo_reserva_vaga: entity.codigoReservaVaga,
      crianca: {
        nome: entity.crianca.nome,
        cpf: entity.crianca.cpf,
        data_nascimento: entity.crianca.dataNascimento,
      },
      responsavel: entity.crianca.responsavel
        ? { nome: entity.crianca.responsavel.nomeRes }
        : null,
      responsavel2: entity.crianca.responsavel2
        ? { nome: entity.crianca.responsavel2.nomeRes }
        : null,
      status: entity.status,
      matricula: entity.matricula,
      observacao: entity.observacao,
      data_referencia: entity.dataReferencia,
      funcionario: {
        nome: entity.funcionario.pessoa.nome,
      },
      turma: {
        nome: entity.vaga.turma.nome,
        id: entity.vaga.turma.id,
        turno: entity.vaga.turma.turno,
        etapa: entity.vaga.turma.etapa.nome,
        apelido: sme?.apelido,
      },
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

  private mapCriterios(matchCriterios: any, secretariaMunicipal: any) {
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

  private async mapEntitiesToData(entities: ReservaVagaEntity[], query: any) {
    const allEtapasLegend = await this.getAllEtapasLegend(
      query.secretariaMunicipalId,
    );

    const groupedData = entities.reduce((acc, entity) => {
      const { vaga, entrevista } = entity;
      const { anoLetivo, escola, turma } = vaga;
      const { etapa } = turma;
      const secretariaMunicipal = escola.secretariaMunicipal;
      const secretariaNome = secretariaMunicipal?.nomeFantasia;

      if (!anoLetivo || !secretariaNome) {
        return acc;
      }

      const sme = etapa.secretariaMunicipalEtapas?.[0];
      const apelido = sme?.apelido || null;

      acc[anoLetivo] ??= {};
      acc[anoLetivo][secretariaNome] ??= {
        escolas: {},
        criterios: [],
        grupos_preferenciais: this.mapGruposPreferenciais(secretariaMunicipal),
        etapas: allEtapasLegend,
      };

      const escolasPath = acc[anoLetivo][secretariaNome].escolas;
      escolasPath[escola.nomeFantasia] ??= {};

      escolasPath[escola.nomeFantasia][etapa.nome] ??= {
        apelido: apelido,
        turnos: {},
      };

      escolasPath[escola.nomeFantasia][etapa.nome].turnos[turma.turno] ??= [];

      escolasPath[escola.nomeFantasia][etapa.nome].turnos[turma.turno].push({
        ...this.mapReservaVagaData(entity),
        criterios: this.mapCriterios(
          entrevista?.matchCriterios,
          secretariaMunicipal,
        ),
      });

      return acc;
    }, {});

    return {
      data: Object.entries(groupedData).map(([year, secretarias]) => ({
        year,
        secretarias: Object.entries(secretarias).map(
          ([
            secretaria,
            { escolas, grupos_preferenciais, etapas: etapasLegenda },
          ]) => ({
            secretaria,
            grupos_preferenciais,
            etapas: etapasLegenda,
            escolas: Object.entries(escolas).map(([escola, etapas]) => ({
              escola,
              etapas: Object.entries(etapas).map(([etapaNome, etapaData]) => {
                return {
                  etapa: etapaNome,
                  apelido: (etapaData as any).apelido,
                  turnos: Object.entries((etapaData as any).turnos).map(
                    ([turno, entries]) => ({
                      turno,
                      entries,
                    }),
                  ),
                };
              }),
            })),
          }),
        ),
      })),
      count: entities.length,
    };
  }
}
