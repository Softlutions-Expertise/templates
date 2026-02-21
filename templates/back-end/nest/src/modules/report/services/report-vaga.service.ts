import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Repository } from 'typeorm';
import { VagaEntity } from '../../escola/entities/vaga.entity';
import { ReportVagaDTO } from '../dtos/report-vaga.dto';

@Injectable()
export class ReportVagaService {
  constructor(
    @Inject('VAGAS_REPOSITORY')
    private vagaRepository: Repository<VagaEntity>,
  ) {}

  async execute(query: any) {
    try {
      const reportVagaDTO = plainToClass(ReportVagaDTO, query);
      await validateOrReject(reportVagaDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const filter = await this.buildQueryBuilder(query);
    const entities = await filter.getMany();

    return await this.mapEntitiesToData(entities, query);
  }

  private async buildQueryBuilder(query: any) {
    const qb = this.vagaRepository.createQueryBuilder('vagas');

    qb.orderBy();

    qb.leftJoin('vagas.escola', 'escola');
    qb.addSelect([
      'escola.id',
      'escola.secretaria_municipal_id',
      'escola.nomeFantasia',
    ]);

    qb.leftJoin('escola.secretariaMunicipal', 'secretaria_municipal');
    qb.addSelect([
      'secretaria_municipal.id',
      'secretaria_municipal.nomeFantasia',
    ]);

    qb.where('secretaria_municipal.id = :secretariaMunicipalId', {
      secretariaMunicipalId: query.secretariaMunicipalId,
    });

    qb.andWhere('vagas.anoLetivo = :anoLetivo', { anoLetivo: query.year });

    if (query.unidadeEscolarId) {
      qb.andWhere('escola.id = :unidadeEscolarId', {
        unidadeEscolarId: query.unidadeEscolarId,
      });
    }

    qb.leftJoin('vagas.turma', 'turma');
    qb.addSelect(['turma.id', 'turma.nome', 'turma.turno', 'turma.etapa_id']);

    qb.leftJoin('turma.etapa', 'etapa');
    qb.addSelect(['etapa.id', 'etapa.nome']);

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

    if (query.etapaId) {
      qb.andWhere('etapa.id = :etapaId', { etapaId: query.etapaId });
    }

    if (query.turn) {
      qb.andWhere('turma.turno = :turn', { turn: query.turn });
    }

    if (query.turmaId) {
      qb.andWhere('vagas.turma_id = :turmaId', { turmaId: query.turmaId });
    }

    switch (query.type) {
      case 'vagas-livres':
        qb.andWhere('vagas.ativa = true');
        break;
      case 'vagas-ocupadas':
        qb.andWhere('vagas.ativa = false');

        qb.leftJoin(
          'vagas.reservaVaga',
          'reserva_vaga',
          'reserva_vaga.vaga_id = vagas.id',
        );
        qb.addSelect(['reserva_vaga.id', 'reserva_vaga.createdAt']);

        qb.leftJoin('reserva_vaga.crianca', 'crianca');
        qb.addSelect(['crianca.id', 'crianca.nome', 'crianca.cpf']);

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

        qb.addOrderBy('reserva_vaga.createdAt', 'ASC');
        break;
    }

    if (query.startDateRegistration) {
      qb.andWhere('DATE(vagas.createdAt) >= :startDateRegistration', {
        startDateRegistration: query.startDateRegistration,
      });
    }

    if (query.endDateRegistration) {
      qb.andWhere('DATE(vagas.createdAt) <= :endDateRegistration', {
        endDateRegistration: query.endDateRegistration,
      });
    }

    qb.addOrderBy('vagas.createdAt', 'ASC');

    return qb;
  }

  private async getAllEtapasLegend(secretariaMunicipalId: string) {
    const smes = await this.vagaRepository
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

  private mapVagaData(entity: VagaEntity) {
    const { anoLetivo, reservaVaga, escola, turma, createdAt } = entity;

    const sme = turma.etapa.secretariaMunicipalEtapas?.[0];
    const apelido = sme?.apelido || null;

    return {
      data_hora_registro: createdAt,
      ano_letivo: anoLetivo,
      secretaria_municipal: escola.secretariaMunicipal.nomeFantasia,
      unidade_escolar: escola.nomeFantasia,
      etapa: turma.etapa.nome,
      apelido: apelido,
      turno: turma.turno,
      turma: turma.nome,
      data_hora_ocupacao: reservaVaga?.createdAt ?? null,
      crianca: reservaVaga?.crianca.nome ?? null,
      cpf: reservaVaga?.crianca.cpf ?? null,
    };
  }

  private async mapEntitiesToData(entities: VagaEntity[], query: any) {
    const allEtapasLegend = await this.getAllEtapasLegend(
      query.secretariaMunicipalId,
    );

    const groupedData = entities.reduce((acc, entity) => {
      const { anoLetivo, escola, turma } = entity;
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
        etapas: allEtapasLegend,
      };

      const escolasPath = acc[anoLetivo][secretariaNome].escolas;
      escolasPath[escola.nomeFantasia] ??= {};

      escolasPath[escola.nomeFantasia][etapa.nome] ??= {
        apelido: apelido,
        turnos: {},
      };

      escolasPath[escola.nomeFantasia][etapa.nome].turnos[turma.turno] ??= [];

      escolasPath[escola.nomeFantasia][etapa.nome].turnos[turma.turno].push(
        this.mapVagaData(entity),
      );

      return acc;
    }, {});

    return {
      data: Object.entries(groupedData).map(([year, secretarias]) => ({
        year,
        secretarias: Object.entries(secretarias).map(
          ([secretaria, { escolas, etapas: etapasLegenda }]) => ({
            secretaria,
            etapas: etapasLegenda,
            escolas: Object.entries(escolas).map(([escola, etapas]) => ({
              escola,
              etapas: Object.entries(etapas).map(([etapaNome, etapaData]) => ({
                etapa: etapaNome,
                apelido: (etapaData as any).apelido,
                turnos: Object.entries((etapaData as any).turnos).map(
                  ([turno, entries]) => ({
                    turno,
                    entries,
                  }),
                ),
              })),
            })),
          }),
        ),
      })),
      count: entities.length,
    };
  }
}
