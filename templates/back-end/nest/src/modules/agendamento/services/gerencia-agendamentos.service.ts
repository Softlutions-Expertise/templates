import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { parse } from 'date-fns';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import PQueue from 'p-queue';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import { TZ_OFFSET } from '../../../config/TZ_OFFSET';
import { getStartOfTodayUtc } from '../../../helpers/dates/getStartOfTodayUTC';
import eventBus from '../../../helpers/eventEmitter.helper';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import { LocalAtendimentoEntity } from '../../local-atendimento/local-atendimento.entity';
import { CreateGerenciaAgendamentoDto } from '../dto/create-gerencia-agendamento.dto';
import { UpdateGerenciaAgendamentoDto } from '../dto/update-gerencia-agendamento.dto';
import { GerenciaAgendamentoEntity } from '../entities/gerencia-agendamento.entity';
import { AgendamentoService } from './agendamento.service';
import { HorariosAgendamentoService } from './horarios-agendamento.service';

type GerenciaAgendamentoInfo = Pick<
  GerenciaAgendamentoEntity,
  | 'intervaloEntrevista'
  | 'numeroAtendimentoIntervalo'
  | 'horarioInicioMatutino'
  | 'horarioFimMatutino'
  | 'horarioInicioVespertino'
  | 'horarioFimVespertino'
  | 'disponibilidadeDomingo'
  | 'disponibilidadeSegunda'
  | 'disponibilidadeTerca'
  | 'disponibilidadeQuarta'
  | 'disponibilidadeQuinta'
  | 'disponibilidadeSexta'
  | 'disponibilidadeSabado'
  | 'ativo'
>;

enum ChangeLevel {
  NONE = 1,
  MINOR = 2,
  BREAKING = 3,
}

enum ChangeReason {
  DECREASED_INTERVAL,
  INCREASED_INTERVAL,
  DECREASED_SCHEDULES_PER_INTERVAL,
  DECREASED_WEEK_DAYS,
  DECREASED_END_DAY_TIMING,
  INCREASED_START_DAY_TIMING,
}

type Change = {
  level: ChangeLevel;
  reason: ChangeReason;
};

type ComparedChanges = {
  changes: Change[];
  highestChangeLevel: ChangeLevel;
};

const extractWeekDaysToggles = (info: GerenciaAgendamentoInfo) => [
  info.disponibilidadeDomingo,
  info.disponibilidadeSegunda,
  info.disponibilidadeTerca,
  info.disponibilidadeQuarta,
  info.disponibilidadeQuinta,
  info.disponibilidadeSexta,
  info.disponibilidadeSabado,
];

const parseTime = (time: string) => {
  return parse(time.replace('h', ':'), 'HH:mm', new Date(0));
};

@Injectable()
export class GerenciaAgendamentoService {
  queue = new PQueue({ concurrency: 1, interval: 1000 });

  constructor(
    @Inject('GERENCIA_AGENDAMENTO_REPOSITORY')
    private repository: Repository<GerenciaAgendamentoEntity>,

    @Inject('LOCAL_ATENDIMENTO_REPOSITORY')
    private localAtendimentoRepository: Repository<LocalAtendimentoEntity>,

    private databaseContextService: DatabaseContextService,

    @Inject(forwardRef(() => AgendamentoService))
    private agendamentoService: AgendamentoService,

    @Inject(forwardRef(() => HorariosAgendamentoService))
    private horariosAgendamentoService: HorariosAgendamentoService,
  ) { }

  get agendamentoRepository() {
    return this.databaseContextService.agendamentoRepository;
  }

  get diaNaoUtilRepository() {
    return this.databaseContextService.diaNaoUtilRepository;
  }

  private compareChanges(
    before: GerenciaAgendamentoInfo,
    after: GerenciaAgendamentoInfo,
  ): ComparedChanges {
    const changes: Change[] = [];

    if (
      parseTime(after.intervaloEntrevista) <
      parseTime(before.intervaloEntrevista)
    ) {
      changes.push({
        level: ChangeLevel.BREAKING,
        reason: ChangeReason.DECREASED_INTERVAL,
      });
    }

    if (
      parseTime(after.intervaloEntrevista) >
      parseTime(before.intervaloEntrevista)
    ) {
      changes.push({
        level: ChangeLevel.BREAKING,
        reason: ChangeReason.INCREASED_INTERVAL,
      });
    }

    if (after.numeroAtendimentoIntervalo < before.numeroAtendimentoIntervalo) {
      changes.push({
        level: ChangeLevel.BREAKING,
        reason: ChangeReason.DECREASED_SCHEDULES_PER_INTERVAL,
      });
    }

    const beforeWeekDaysToggles = extractWeekDaysToggles(before);
    const afterWeekDaysToggles = extractWeekDaysToggles(after);

    // verifica se algum dia passou de ativo para inativo
    const deactivatedSomeWeekDay = afterWeekDaysToggles.some(
      (afterWeekDayToggle, index) => {
        // caso um dia de semana esteja desativado, mas antes estava ativo
        if (!afterWeekDayToggle && beforeWeekDaysToggles[index]) {
          return true;
        }

        return false;
      },
    );

    if (deactivatedSomeWeekDay) {
      changes.push({
        level: ChangeLevel.BREAKING,
        reason: ChangeReason.DECREASED_WEEK_DAYS,
      });
    }

    if (
      parseTime(after.horarioFimMatutino) <
      parseTime(before.horarioFimMatutino) ||
      parseTime(after.horarioFimVespertino) <
      parseTime(before.horarioFimVespertino)
    ) {
      changes.push({
        level: ChangeLevel.BREAKING,
        reason: ChangeReason.DECREASED_END_DAY_TIMING,
      });
    }

    if (
      parseTime(after.horarioInicioMatutino) >
      parseTime(before.horarioInicioMatutino) ||
      parseTime(after.horarioInicioVespertino) >
      parseTime(before.horarioInicioVespertino)
    ) {
      changes.push({
        level: ChangeLevel.BREAKING,
        reason: ChangeReason.INCREASED_START_DAY_TIMING,
      });
    }

    const highestChangeLevel = changes.reduce(
      (highestChangeLevelAccumulated, { level }) => {
        return <ChangeLevel>Math.max(highestChangeLevelAccumulated, +level);
      },
      ChangeLevel.NONE,
    );

    return {
      changes,
      highestChangeLevel,
    };
  }

  async internalFindOne(id: string): Promise<GerenciaAgendamentoEntity> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`gerencia não encontrada`);
    }

    return entity;
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<GerenciaAgendamentoEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: [
        'localAtendimento',
        'localAtendimento.contato',
        'localAtendimento.endereco',
        'localAtendimento.secretariaMunicipal',
      ],
    });

    if (!entity) {
      throw new NotFoundException(`gerencia não encontrada`);
    }

    const qbSecretaria =
      this.databaseContextService.secretariaMunicipalRepository.createQueryBuilder(
        'secretaria',
      );

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'secretaria:gerencia_agendamento:read',
        qbSecretaria,
        entity.localAtendimento.secretariaMunicipal.id,
      );
    }

    return entity;
  }

  async internalFindAllGerenciaAgendamento(): Promise<
    GerenciaAgendamentoEntity[]
  > {
    return this.repository.find();
  }

  async findAllGerenciaAgendamento(
    acessoControl: AcessoControl,
  ): Promise<GerenciaAgendamentoEntity[]> {
    const qb = this.repository.createQueryBuilder('gerencia_agendamento');

    qb.leftJoinAndSelect(
      'gerencia_agendamento.localAtendimento',
      'localAtendimento',
    );
    qb.leftJoinAndSelect(
      'localAtendimento.secretariaMunicipal',
      'secretariaMunicipal',
    );

    const qbSecretaria =
      this.databaseContextService.secretariaMunicipalRepository.createQueryBuilder(
        'secretaria',
      );

    const secretariaIds = await acessoControl.getReachableTargetsTypeorm(
      'secretaria:gerencia_agendamento:read',
      qbSecretaria,
    );

    qb.where('secretariaMunicipal.id IN (:...secretariaIds)', {
      secretariaIds,
    });

    return await qb.getMany();
  }

  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
  ): Promise<Paginated<GerenciaAgendamentoEntity>> {
    const qb = this.repository.createQueryBuilder('gerencia_agendamento');

    if (acessoControl) {
      // Adicionar joins necessários para o controle de acesso funcionar
      qb.leftJoin('gerencia_agendamento.localAtendimento', 'l_a');
      qb.leftJoin('l_a.secretariaMunicipal', 'secretariaMunicipal');

      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'secretaria:gerencia_agendamento:read',
        qb,
      );
    }

    return paginate(query, qb, {
      ...paginateConfig,
      defaultSortBy: [['createdAt', 'ASC']],
      relations: {
        localAtendimento: {
          contato: true,
          endereco: {
            cidade: true,
          },
          secretariaMunicipal: true,
        },
      },
      filterableColumns: {
        ativo: [FilterOperator.EQ],
        'localAtendimento.ativo': [FilterOperator.EQ],
        'localAtendimento.secretariaMunicipal.id': [FilterOperator.EQ],
        'localAtendimento.endereco.cidade.id': [FilterOperator.EQ],
        'localAtendimento.id': [FilterOperator.EQ],
      },
      searchableColumns: [
        'localAtendimento.secretariaMunicipal.nomeFantasia',
        'localAtendimento.secretariaMunicipal.razaoSocial',
        'localAtendimento.nome',
        'intervaloEntrevista',
        'numeroAtendimentoIntervalo',
        'horarioInicioMatutino',
        'horarioFimMatutino',
        'horarioInicioVespertino',
        'horarioFimVespertino',
      ],
    });
  }

  async create(
    acessoControl: AcessoControl,
    data: CreateGerenciaAgendamentoDto,
  ) {
    // Buscar o localAtendimento e sua secretaria
    const localAtendimento = await this.localAtendimentoRepository.findOne({
      where: { id: data.localAtendimento.id },
      relations: ['secretariaMunicipal'],
    });

    if (!localAtendimento) {
      throw new NotFoundException(`Local de atendimento não encontrado`);
    }

    // Verificar se o local de atendimento já está sendo usado em outra gerência
    const existingGerencia = await this.repository.findOne({
      where: {
        localAtendimento: { id: data.localAtendimento.id },
      },
      relations: ['localAtendimento'],
    });

    if (existingGerencia) {
      throw new BadRequestException(
        `Local de atendimento já está sendo usado em outra gerência de agendamento`,
      );
    }

    await acessoControl.ensureCanReachTarget(
      'secretaria:gerencia_agendamento:update',
      null,
      localAtendimento.secretariaMunicipal.id,
      data,
    );

    const gerenciaAgendamento = this.repository.create({
      ...data,
      id: uuidv4(),
    });

    await this.repository.save(gerenciaAgendamento);

    eventBus.emit('syncDiasNaoUteis');

    return gerenciaAgendamento;
  }

  async rescheduleAgendamento(idGerencia: string, agendamentoId: string) {
    const agendamento = await this.agendamentoService.findOne(
      null,
      agendamentoId,
    );

    const proximoDiaDisponivel =
      await this.horariosAgendamentoService.getProximoDiaDisponivelByIdGerencia(
        idGerencia,
        getStartOfTodayUtc(),
        Infinity,
      );

    const novaDataAgendamento = new Date(proximoDiaDisponivel.data);
    novaDataAgendamento.setUTCHours(TZ_OFFSET, 0, 0, 0); // "data": "2024-06-12T04:00:00.000Z"

    const {
      horariosDisponiveis: [primeiroHorarioFuturo],
    } = proximoDiaDisponivel;

    agendamento.data = novaDataAgendamento;
    agendamento.horario = primeiroHorarioFuturo;
    agendamento.reagendamentoEmProgresso = false;

    await this.agendamentoService.update(null, agendamentoId, agendamento);
  }

  async checkMatrizEncaixeExiste(
    gerenciaAgendamento: GerenciaAgendamentoEntity,
  ) {
    return (
      extractWeekDaysToggles(gerenciaAgendamento).some(Boolean) &&
      gerenciaAgendamento.numeroAtendimentoIntervalo > 0
    );
  }

  private async rescheduleCore(
    idGerencia: string,
    comparedChanges: ComparedChanges | null = null,
    force = false,
  ) {
    const ENABLE_FORCE = false;

    const gerencia = await this.findOne(null, idGerencia);

    const idSecretaria = gerencia.localAtendimento.secretariaMunicipal.id;

    const hasBreakingChanges =
      comparedChanges &&
      comparedChanges.highestChangeLevel === ChangeLevel.BREAKING;

    const hasForceReschedule = ENABLE_FORCE && force;

    if (hasBreakingChanges || hasForceReschedule) {
      const gerenciaAgendamento = await this.findOne(null, idGerencia);

      const matrizEncaixeExiste = await this.checkMatrizEncaixeExiste(
        gerenciaAgendamento,
      );

      if (!matrizEncaixeExiste) {
        return;
      }

      //pegar os agentamentos futuros
      const agendamentos = await this.agendamentoService.getAgendamentosFuturos(
        idSecretaria,
      );

      // define o atributo "reagendamento_em_progresso" para "TRUE" em todos os agendamentos
      // que serão reagendados, para que não sejam considerados no "AgendamentoService#horariosDisponiveis"

      await this.agendamentoRepository
        .createQueryBuilder()
        .update()
        .set({ reagendamentoEmProgresso: true })
        .whereInIds(agendamentos.map((agendamento) => agendamento.id))
        .execute();

      // agendamentos deve vir ordenado
      for (const agendamento of agendamentos) {
        await this.rescheduleAgendamento(idGerencia, agendamento.id);
      }

      //enviar email para os responsaveis
    } else {
      await this.rescheduleCoreWorkDays(idGerencia, idSecretaria);
    }
  }

  private async rescheduleCoreWorkDays(
    idGerencia: string,
    idSecretaria: string,
  ) {
    const qb = this.diaNaoUtilRepository.createQueryBuilder('diaNaoUtil');

    qb.innerJoin('diaNaoUtil.gerenciaAgendamento', 'gerenciaAgendamento');

    qb.where('gerenciaAgendamento.id = :idGerencia', { idGerencia });

    qb.andWhere('CAST(diaNaoUtil.dataFeriado as DATE) >= CAST(:data as DATE)', {
      data: getStartOfTodayUtc(),
    });

    qb.andWhere('diaNaoUtil.ativo = TRUE');

    const diasNaoUteis = await qb.getMany();

    for (const diaNaoUtil of diasNaoUteis) {
      const qb = this.agendamentoRepository.createQueryBuilder('agendamento');

      const dataReferencia = new Date(diaNaoUtil.dataFeriado);
      dataReferencia.setUTCHours(TZ_OFFSET, 0, 0, 0);

      qb.where('CAST(:data as DATE) = CAST(agendamento.data as DATE)', {
        data: dataReferencia,
      });

      qb.andWhere('agendamento.reagendamentoEmProgresso = FALSE');

      qb.innerJoin('agendamento.secretariaMunicipal', 'secretaria');
      qb.andWhere('secretaria.id = :idSecretaria', {
        idSecretaria: idSecretaria,
      });

      const agendamentosConflitantes = await qb.getMany();

      await this.agendamentoRepository
        .createQueryBuilder()
        .update()
        .set({ reagendamentoEmProgresso: true })
        .whereInIds(
          agendamentosConflitantes.map((agendamento) => agendamento.id),
        )
        .execute();

      for (const agendamento of agendamentosConflitantes) {
        await this.rescheduleAgendamento(idGerencia, agendamento.id);
      }
    }
  }

  private async reschedule(
    idGerencia: string,
    comparedChanges: ComparedChanges | null = null,
    force = false,
  ) {
    return this.queue.add(() => {
      return this.rescheduleCore(idGerencia, comparedChanges, force);
    });
  }

  async update(
    acessoControl: AcessoControl,
    id: string,
    data: UpdateGerenciaAgendamentoDto,
  ): Promise<GerenciaAgendamentoEntity> {
    const entity = await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'secretaria:gerencia_agendamento:update',
      null,
      entity.localAtendimento.secretariaMunicipal.id,
      {
        ...data,
        localAtendimento: {
          id: entity.localAtendimento.id,
        },
      },
    );

    // Verificar se o local de atendimento está sendo alterado
    if (
      data.localAtendimento &&
      data.localAtendimento.id !== entity.localAtendimento.id
    ) {
      // Verificar se o novo local de atendimento já está sendo usado em outra gerência
      const existingGerencia = await this.repository.findOne({
        where: {
          localAtendimento: { id: data.localAtendimento.id },
        },
        relations: ['localAtendimento'],
      });

      if (existingGerencia && existingGerencia.id !== id) {
        throw new BadRequestException(
          `Local de atendimento já está sendo usado em outra gerência de agendamento`,
        );
      }
    }

    const before: GerenciaAgendamentoInfo = structuredClone(entity);

    const configuracao_agendamento = this.repository.merge(entity, data);

    const after: GerenciaAgendamentoInfo = structuredClone(
      configuracao_agendamento,
    );

    const comparedChanges = this.compareChanges(before, after);

    await this.repository.save(configuracao_agendamento);

    this.reschedule(entity.id, comparedChanges);

    return this.findOne(acessoControl, entity.id);
  }

  async remove(acessoControl: AcessoControl, id: string) {
    const entity = await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'secretaria:gerencia_agendamento:update',
      null,
      entity.localAtendimento.secretariaMunicipal.id,
    );

    const agendamentos = await this.agendamentoService.getAgendamentosFuturos(
      entity.localAtendimento.secretariaMunicipal.id,
      true,
    );

    for (const agendamento of agendamentos) {
      await this.agendamentoService.remove(null, agendamento.id);
    }

    return this.repository.remove(entity);
  }

  async rescheduleAgendamentos(
    acessoControl: AcessoControl | null,
    idSecretaria: string | null,
  ) {
    const qb = this.repository.createQueryBuilder('gerenciaAgendamento');

    qb.innerJoin('gerenciaAgendamento.localAtendimento', 'localAtendimento');
    qb.innerJoin('localAtendimento.secretariaMunicipal', 'secretaria');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'secretaria:gerencia_agendamento:update',
        qb,
      );
    }

    if (idSecretaria) {
      qb.andWhere('secretaria.id = :idSecretariaReference', {
        idSecretariaReference: idSecretaria,
      });
    }

    qb.select(['gerenciaAgendamento.id']);

    const gerenciaAgendamentoList = await qb.getMany();

    for (const gerenciaAgendamento of gerenciaAgendamentoList) {
      await this.reschedule(gerenciaAgendamento.id, null, false);
    }

    return {
      total: gerenciaAgendamentoList.length,
    };
  }
}
