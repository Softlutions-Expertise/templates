import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { FilterComparator } from 'nestjs-paginate/lib/filter';
import { Brackets } from 'typeorm';
import { DIAS_NAO_UTEIS_NACIONAIS, logDebug } from '../../../config/options';
import { paginateConfig } from '../../../config/paginate.config';
import { getYearStartEnd } from '../../../helpers/dates/getYearStartEnd';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import {
  DeactivateManyDiasNaoUteisDto,
  IDeactivateDiasNaoUteisTarget,
  IDeactivateDiasNaoUteisTargetDiaNaoUtil,
  IDeactivateDiasNaoUteisTargetFeriado,
} from '../dto/deactivate-many-dias-nao-uteis.dto';
import { CreateDiasNaoUteisDto } from '../dto/dias-nao-uteis.dto';
import { UpdateDiasNaoUteisDto } from '../dto/update-dias-nao-uteis.dto';
import { DiasNaoUteisEntity } from '../entities/dias-nao-uteis.entity';
import { GerenciaAgendamentoEntity } from '../entities/gerencia-agendamento.entity';
import { DiasNaoUteisSyncService } from './dias-nao-uteis-sync.service';
import { GerenciaAgendamentoService } from './gerencia-agendamentos.service';

@Injectable()
export class DiasNaoUteisService {
  constructor(
    private diasNaoUteisSyncService: DiasNaoUteisSyncService,
    private databaseContextService: DatabaseContextService,
    private gerenciaAgendamentoService: GerenciaAgendamentoService,
  ) { }

  private async ensureCanManage(
    acessoControl: AcessoControl | null,
    idGerenciaAgendamento: string,
  ) {
    if (acessoControl) {
      const gerenciaAgendamento = await this.gerenciaAgendamentoService.findOne(
        null,
        idGerenciaAgendamento,
      );

      const secretariaMunicipal = gerenciaAgendamento.localAtendimento.secretariaMunicipal;

      await acessoControl.ensureCanReachTarget(
        'secretaria:gerencia_agendamento:update',
        null,
        secretariaMunicipal.id,
      );
    }
  }

  get diaNaoUtilRepository() {
    return this.databaseContextService.diaNaoUtilRepository;
  }

  get feriadoRepository() {
    return this.databaseContextService.feriadoRepository;
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: number,
  ): Promise<DiasNaoUteisEntity> {
    const entity = await this.diaNaoUtilRepository.findOne({
      where: { id },
      relations: ['gerenciaAgendamento'],
    });

    if (!entity) {
      throw new NotFoundException(`Dia não encontrado`);
    }

    if (acessoControl) {
      const gerenciaAgendamento = await this.gerenciaAgendamentoService.findOne(
        null,
        entity.gerenciaAgendamento.id,
      );

      const secretariaMunicipal = gerenciaAgendamento.localAtendimento.secretariaMunicipal;

      await acessoControl.ensureCanReachTarget(
        'secretaria:gerencia_agendamento:read',
        null,
        secretariaMunicipal.id,
      );
    }

    return entity;
  }

  async findAll(
    acessoControl: AcessoControl | null,
    query: PaginateQuery,
    filters: {
      atingeGerenciaAgendamentoId: GerenciaAgendamentoEntity['id'] | null;
      atingeAno: number | null;
    },
  ): Promise<Paginated<DiasNaoUteisEntity>> {
    const qb = this.diaNaoUtilRepository.createQueryBuilder('diaNaoUtil');

    qb.leftJoin('diaNaoUtil.gerenciaAgendamento', 'gerenciaAgendamento');
    qb.leftJoin('gerenciaAgendamento.localAtendimento', 'localAtendimento');
    qb.leftJoin('localAtendimento.secretariaMunicipal', 'secretaria');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'secretaria:gerencia_agendamento:read',
        qb,
      );
    }

    const { atingeAno, atingeGerenciaAgendamentoId } = filters;

    if (atingeGerenciaAgendamentoId) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('gerenciaAgendamento.id = :atingeGerenciaAgendamentoId', {
            atingeGerenciaAgendamentoId,
          });

          if (DIAS_NAO_UTEIS_NACIONAIS) {
            qb.orWhere('gerenciaAgendamento.id IS NULL');
          }
        }),
      );
    }

    if (atingeAno) {
      const [filterDataInicio, filterDataFim] = getYearStartEnd(atingeAno);

      qb.andWhere(
        new Brackets((qb) => {
          qb.where(
            'diaNaoUtil.dataFeriado BETWEEN :filterDataInicio AND :filterDataFim',
            {
              filterDataInicio,
              filterDataFim,
            },
          );
        }),
      );
    }

    return paginate(query, qb, {
      ...paginateConfig,
      sortableColumns: ['dataFeriado'],
      relations: ['gerenciaAgendamento'],
      defaultSortBy: [['dataFeriado', 'ASC']],
      filterableColumns: {
        id: [FilterOperator.IN, FilterSuffix.NOT],
        ativo: [FilterOperator.EQ, FilterSuffix.NOT],
        'gerenciaAgendamento.id': [
          FilterOperator.EQ,
          FilterOperator.NULL,
          FilterSuffix.NOT,
          FilterComparator.AND,
          FilterComparator.OR,
          FilterOperator.IN,
        ],
        dataFeriado: [
          FilterOperator.EQ,
          FilterOperator.GT,
          FilterOperator.GTE,
          FilterOperator.LTE,
          FilterOperator.LT,
          FilterComparator.AND,
          FilterComparator.OR,
          FilterOperator.BTW,
        ],
      },
    });
  }

  async create(
    acessoControl: AcessoControl | null,
    data: CreateDiasNaoUteisDto,
  ) {
    const gerenciaAgendamento = await this.gerenciaAgendamentoService.findOne(
      null,
      data.gerenciaAgendamento.id,
    );

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'secretaria:gerencia_agendamento:update',
        null,
        gerenciaAgendamento.localAtendimento.secretariaMunicipal.id,
      );
    }

    const agendamento = this.diaNaoUtilRepository.create({
      ...data,
    });

    const entity = await this.diaNaoUtilRepository.save(agendamento);

    return entity;
  }

  async checkDiaNaoUtuil(idGerenciaAgendamento: string, data: Date) {
    const qb = this.diaNaoUtilRepository.createQueryBuilder('diaNaoUtil');

    qb.select(['diaNaoUtil.id']);

    qb.where('CAST(:data as DATE) = CAST(diaNaoUtil.dataFeriado as DATE)', {
      data: data,
    });

    qb.leftJoin('diaNaoUtil.gerenciaAgendamento', 'gerenciaAgendamento');

    qb.andWhere(
      new Brackets((qb) => {
        qb.andWhere('gerenciaAgendamento.id = :idGerenciaAgendamento', {
          idGerenciaAgendamento: idGerenciaAgendamento,
        }).orWhere('gerenciaAgendamento.id IS NULL');
      }),
    );

    qb.andWhere('diaNaoUtil.ativo = TRUE');

    const entity = await qb.getOne();

    return entity !== null;
  }

  async update(
    acessoControl: AcessoControl | null,
    id: number,
    data: UpdateDiasNaoUteisDto,
  ) {
    const entity = await this.findOne(null, id);

    if (acessoControl) {
      const gerenciaAgendamento = await this.gerenciaAgendamentoService.findOne(
        null,
        entity.gerenciaAgendamento.id,
      );

      const secretariaMunicipal = gerenciaAgendamento.localAtendimento.secretariaMunicipal;

      await acessoControl.ensureCanReachTarget(
        'secretaria:gerencia_agendamento:update',
        null,
        secretariaMunicipal.id,
      );
    }

    this.diaNaoUtilRepository.merge(entity, {
      ...data,
      id,
      updatedAt: new Date(),
    });

    await this.diaNaoUtilRepository.save(entity);

    return this.findOne(acessoControl, id);
  }

  async remove(acessoControl: AcessoControl | null, id: number) {
    const entity = await this.findOne(null, id);

    if (acessoControl) {
      const gerenciaAgendamento = await this.gerenciaAgendamentoService.findOne(
        null,
        entity.gerenciaAgendamento.id,
      );

      const secretariaMunicipal = gerenciaAgendamento.localAtendimento.secretariaMunicipal;

      await acessoControl.ensureCanReachTarget(
        'secretaria:gerencia_agendamento:update',
        null,
        secretariaMunicipal.id,
      );
    }

    return this.diaNaoUtilRepository.remove(entity);
  }

  private async deactivateTargetFeriado(
    acessoControl: AcessoControl | null,
    target: IDeactivateDiasNaoUteisTargetFeriado,
  ) {
    await this.ensureCanManage(acessoControl, target.gerenciaAgendamento.id);

    const qbFeriado = this.feriadoRepository.createQueryBuilder('feriado');

    qbFeriado.where('feriado.id = :idFeriado', {
      idFeriado: target.feriado.id,
    });

    const feriado = await qbFeriado.getOne();

    if (!feriado) {
      return { success: false, reason: 'feriado-not-found' };
    }

    await this.diasNaoUteisSyncService.syncDiasNaoUteisGerenciaAgendamento(
      +feriado.data.split('-')[0],
      target.gerenciaAgendamento.id,
    );

    const qbDiaNaoUtil =
      this.diaNaoUtilRepository.createQueryBuilder('diaNaoUtil');

    qbDiaNaoUtil.where('diaNaoUtil.tituloFeriado = :tituloFeriado', {
      tituloFeriado: feriado.titulo,
    });

    qbDiaNaoUtil.andWhere(
      'CAST(diaNaoUtil.dataFeriado as DATE) = CAST(:feriadoDate as DATE)',
      { feriadoDate: feriado.data },
    );

    qbDiaNaoUtil.innerJoin(
      'diaNaoUtil.gerenciaAgendamento',
      'gerenciaAgendamento',
    );

    qbDiaNaoUtil.andWhere('gerenciaAgendamento.id = :idGerenciaAgendamento', {
      idGerenciaAgendamento: target.gerenciaAgendamento.id,
    });

    const diaNaoUtil = await qbDiaNaoUtil.getOne();

    if (!diaNaoUtil) {
      return { success: false, reason: 'feriado-dia-nao-util-not-found' };
    }

    return this.deactivateTargetDiaNaoUtil(acessoControl, {
      kind: 'diaNaoUtil',
      gerenciaAgendamento: target.gerenciaAgendamento,
      diaNaoUtil,
    });
  }

  private async deactivateTargetDiaNaoUtil(
    acessoControl: AcessoControl | null,
    target: IDeactivateDiasNaoUteisTargetDiaNaoUtil,
  ) {
    await this.ensureCanManage(acessoControl, target.gerenciaAgendamento.id);

    const qbDiaNaoUtil =
      this.diaNaoUtilRepository.createQueryBuilder('diaNaoUtil');

    qbDiaNaoUtil.where('diaNaoUtil.id = :idDiaNaoUtil', {
      idDiaNaoUtil: target.diaNaoUtil.id,
    });

    qbDiaNaoUtil.innerJoin(
      'diaNaoUtil.gerenciaAgendamento',
      'gerenciaAgendamento',
    );

    qbDiaNaoUtil.andWhere('gerenciaAgendamento.id = :idGerenciaAgendamento', {
      idGerenciaAgendamento: target.gerenciaAgendamento.id,
    });

    const diaNaoUtil = await qbDiaNaoUtil.getOne();

    if (!diaNaoUtil) {
      return { success: false, reason: 'dia-nao-util-not-found' };
    }

    await this.diaNaoUtilRepository
      .createQueryBuilder()
      .update({ ativo: false })
      .where('id =  :idDiaNaoUtil', { idDiaNaoUtil: diaNaoUtil.id })
      .execute();

    return { sucess: true, reason: null };
  }

  private async deactivateTarget(
    acessoControl: AcessoControl | null,
    target: IDeactivateDiasNaoUteisTarget,
  ) {
    if (target.kind === 'diaNaoUtil') {
      return this.deactivateTargetDiaNaoUtil(acessoControl, target);
    } else {
      return this.deactivateTargetFeriado(acessoControl, target);
    }
  }

  async deactivateManyDiasNaoUteis(
    acessoControl: AcessoControl | null,
    dto: DeactivateManyDiasNaoUteisDto,
  ) {
    const getTargets =
      async function* (): AsyncIterable<IDeactivateDiasNaoUteisTarget> {
        const idGerenciaAgendamento = dto.gerenciaAgendamento.id;

        for (const feriado of dto.feriados) {
          yield {
            kind: 'feriado',
            feriado,
            gerenciaAgendamento: { id: idGerenciaAgendamento },
          };
        }

        for (const diaNaoUtil of dto.diasNaoUteis) {
          yield {
            kind: 'diaNaoUtil',
            diaNaoUtil,
            gerenciaAgendamento: { id: idGerenciaAgendamento },
          };
        }
      };

    for await (const target of getTargets()) {
      logDebug({ target });
      const response = await this.deactivateTarget(acessoControl, target);
      logDebug({ response });
    }
  }
}
