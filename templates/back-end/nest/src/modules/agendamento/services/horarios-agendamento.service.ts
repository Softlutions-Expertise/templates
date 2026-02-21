import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import {
  addDays,
  getHours,
  getMinutes,
  isBefore,
  isSameDay,
  isValid as isValidDate,
  parse,
  set,
  startOfDay,
} from 'date-fns';
import { Repository } from 'typeorm';
import { TZ_OFFSET } from '../../../config/TZ_OFFSET';
import { generateDiasAnoMes } from '../../../helpers/dates/generateDiasAnoMes';
import { generateDiasIntervalo } from '../../../helpers/dates/generateDiasIntervalo';
import { generateTimes } from '../../../helpers/dates/generateTimes';
import { CreateGerenciaAgendamentoDto } from '../dto/create-gerencia-agendamento.dto';
import { AgendamentoEntity } from '../entities/agendamento.entity';
import { GerenciaAgendamentoEntity } from '../entities/gerencia-agendamento.entity';
import { checkActiveDay } from '../utils/active-day';
import { DiasNaoUteisService } from './dias-nao-uteis.service';
import { GerenciaAgendamentoService } from './gerencia-agendamentos.service';

export enum SituacaoDiaStatus {
  DISPONIVEL = 'disponivel',
  PASSADO = 'indisponivel/passado',
  DIA_NAO_UTIL = 'indisponivel/dia-nao-util',
  LOTADO = 'indisponivel/lotado',
}

export type SituacaoDia = {
  data: Date | string;
  horariosDisponiveis: string[];
} & (
    | { ativo: true; status: SituacaoDiaStatus.DISPONIVEL }
    | {
      ativo: false;
      status: Exclude<SituacaoDiaStatus, SituacaoDiaStatus.DISPONIVEL>;
    }
  );

@Injectable()
export class HorariosAgendamentoService {
  constructor(
    @Inject('AGENDAMENTO_REPOSITORY')
    private repository: Repository<AgendamentoEntity>,

    @Inject(forwardRef(() => GerenciaAgendamentoService))
    private gerenciaAgendamentoService: GerenciaAgendamentoService,

    //dias nao uteis
    @Inject(forwardRef(() => DiasNaoUteisService))
    private diasNaoUteisService: DiasNaoUteisService,
  ) { }

  async getAllHorariosByGerencia(
    gerenciaAgendamento: GerenciaAgendamentoEntity,
  ) {
    const horarios = await this.geraHorariosGerenciaAgendamento(
      gerenciaAgendamento,
    );

    return horarios;
  }

  async getAllHorariosByIdGerencia(idGerencia: string) {
    const gerenciaAgendamento =
      await this.gerenciaAgendamentoService.internalFindOne(idGerencia);

    return this.getAllHorariosByGerencia(gerenciaAgendamento);
  }

  async horariosDisponiveisByGerenciaAndDia(
    gerencia: GerenciaAgendamentoEntity,
    data: Date,
  ) {
    const diaUtil = await this.checarDiaUtil(gerencia, data);

    if (!diaUtil) {
      return [];
    }

    const qb = this.repository.createQueryBuilder('agendamento');

    qb.select(['agendamento.id', 'agendamento.horario']);
    qb.innerJoin('agendamento.secretariaMunicipal', 'secretaria');
    qb.where('CAST(:data as DATE) = CAST(agendamento.data as DATE)', {
      data: data,
    });
    qb.andWhere('agendamento.reagendamentoEmProgresso = FALSE');
    qb.andWhere('secretaria.id = :idSecretaria', {
      idSecretaria: gerencia.localAtendimento.secretariaMunicipal.id,
    });

    const agendamentos = await qb.getMany();

    const horariosAgendados = agendamentos.map(
      (agendamento) => agendamento.horario,
    );

    const horarios = await this.geraHorariosGerenciaAgendamento(gerencia);

    const now = new Date();
    const startOfToday = startOfDay(now);

    const sameDay = isSameDay(startOfDay(data), startOfToday);

    const horariosDisponiveis = horarios
      .filter((horario) => {
        if (sameDay) {
          const [hora, minuto] = horario.split(':');

          const todayAtHorario = set(startOfToday, {
            hours: +hora + TZ_OFFSET,
            minutes: +minuto,
          });

          return now < todayAtHorario;
        }

        return true;
      })

      .filter((horario) => {
        const quantidadeHorario = horariosAgendados.filter(
          (i) => i === horario,
        ).length;

        return quantidadeHorario < gerencia.numeroAtendimentoIntervalo;
      });

    return horariosDisponiveis;
  }

  async horariosDisponiveisByIdGerenciaAndDia(idGerencia: string, data: Date) {
    const gerencia = await this.gerenciaAgendamentoService.internalFindOne(
      idGerencia,
    );

    return this.horariosDisponiveisByGerenciaAndDia(gerencia, data);
  }

  async geraHorariosGerenciaAgendamento(
    dto: CreateGerenciaAgendamentoDto,
  ): Promise<string[]> {
    let horarios: string[] = [];

    try {
      const { intervaloEntrevista } = dto;

      if (
        // Garantir que é uma string válida
        typeof intervaloEntrevista !== 'string' ||
        // Deve seguir o formato 00:00
        !intervaloEntrevista.match(/^\d{2}:\d{2}$/)
      ) {
        throw new Error('intervalo da entrevista deve seguir HH:mm');
      }

      const intervalAsDate = parse(intervaloEntrevista, 'HH:mm', new Date());

      if (!isValidDate(intervalAsDate)) {
        throw new Error(
          'intervalo da entrevista segue HH:mm, mas possui valores inválidos',
        );
      }

      const intervalMinutes =
        getHours(intervalAsDate) * 60 + getMinutes(intervalAsDate);

      if (dto.horarioInicioMatutino && dto.horarioFimMatutino) {
        horarios = [
          ...horarios,
          ...generateTimes(
            dto.horarioInicioMatutino,
            dto.horarioFimMatutino,
            intervalMinutes,
          ),
        ];
      }

      if (dto.horarioInicioVespertino && dto.horarioFimVespertino) {
        horarios = [
          ...horarios,
          ...generateTimes(
            dto.horarioInicioVespertino,
            dto.horarioFimVespertino,
            intervalMinutes,
          ),
        ];
      }

      return horarios;
    } catch (er) {
      return [];
    }
  }

  async checarDiaUtil(gerencia: GerenciaAgendamentoEntity, dataAlvo: Date) {
    const isActiveDay = checkActiveDay(gerencia, dataAlvo);

    if (!isActiveDay) {
      return false;
    }

    const diaNaoUtil = await this.diasNaoUteisService.checkDiaNaoUtuil(
      gerencia.id,
      dataAlvo,
    );

    if (diaNaoUtil) {
      return false;
    }

    return true;
  }

  async checarDiaByGerenciaAndData(
    gerencia: GerenciaAgendamentoEntity,
    dataAlvo: Date,
  ): Promise<SituacaoDia> {
    const hoje = startOfDay(new Date());

    if (isBefore(dataAlvo, hoje)) {
      return {
        data: dataAlvo,
        ativo: false,
        status: SituacaoDiaStatus.PASSADO,
        horariosDisponiveis: [],
      };
    }

    const diaUtil = await this.checarDiaUtil(gerencia, dataAlvo);

    if (!diaUtil) {
      return {
        data: dataAlvo,
        ativo: false,
        status: SituacaoDiaStatus.DIA_NAO_UTIL,
        horariosDisponiveis: [],
      };
    }

    const horariosDisponiveis = await this.horariosDisponiveisByGerenciaAndDia(
      gerencia,
      dataAlvo,
    );

    if (horariosDisponiveis.length === 0) {
      return {
        data: dataAlvo,
        ativo: false,
        status: SituacaoDiaStatus.LOTADO,
        horariosDisponiveis: [],
      };
    }

    return {
      data: dataAlvo,
      ativo: true,
      status: SituacaoDiaStatus.DISPONIVEL,
      horariosDisponiveis,
    };
  }

  async *checarDiasDisponiveisByIdGerenciaAndDatas(
    idGerencia: string,
    datas: Iterable<Date> | AsyncIterable<Date>,
  ): AsyncIterable<SituacaoDia> {
    const gerencia = await this.gerenciaAgendamentoService.internalFindOne(
      idGerencia,
    );

    for await (const data of datas) {
      yield await this.checarDiaByGerenciaAndData(gerencia, data);
    }
  }

  async checarDiasDisponiveisAnoMes(
    idGerencia: string,
    anoReferencia: number,
    mesReferencia: number,
  ) {
    return this.checarDiasDisponiveisByIdGerenciaAndDatas(
      idGerencia,
      generateDiasAnoMes(anoReferencia, mesReferencia),
    );
  }

  async checarDiasDisponiveisIntervalo(
    idGerencia: string,
    inicio: Date | string | number,
    fim: Date | string | number,
  ) {
    return this.checarDiasDisponiveisByIdGerenciaAndDatas(
      idGerencia,
      generateDiasIntervalo(inicio, fim),
    );
  }

  async *getProximosDiasDisponiveisByGerencia(
    gerencia: GerenciaAgendamentoEntity,
    inicioReferencia: Date | string | number | null | undefined,
    maxOffset: number = 10,
    limitActive = Infinity,
  ) {
    let dataInicio = startOfDay(new Date());

    const inicioReferenciaDate = inicioReferencia && new Date(inicioReferencia);

    if (isValidDate(inicioReferenciaDate)) {
      const inicioReferenciaDiaDate = startOfDay(inicioReferenciaDate);

      if (!isBefore(inicioReferenciaDiaDate, dataInicio)) {
        dataInicio = inicioReferenciaDiaDate;
      }
    }

    let ativos = 0;

    for (let i = 0; i < maxOffset && ativos < limitActive; i++) {
      const offsetDate = addDays(dataInicio, i);

      const situacao = await this.checarDiaByGerenciaAndData(
        gerencia,
        offsetDate,
      );

      if (situacao.ativo) {
        yield situacao;
        ativos++;
      }
    }
  }

  async *getProximosDiasDisponiveisByIdGerencia(
    idGerencia: string,
    inicioReferencia: Date | string | number | null | undefined,
    maxOffset: number = 10,
    limitActive = Infinity,
  ) {
    const gerencia = await this.gerenciaAgendamentoService.internalFindOne(
      idGerencia,
    );

    yield* this.getProximosDiasDisponiveisByGerencia(
      gerencia,
      inicioReferencia,
      maxOffset,
      limitActive,
    );
  }

  async getProximoDiaDisponivelByIdGerencia(
    idGerencia: string,
    inicioReferencia: Date | string | number | null,
    maxOffset = 1000,
  ) {
    const gerencia = await this.gerenciaAgendamentoService.findOne(
      null,
      idGerencia,
    );

    const matrizEncaixeExiste =
      await this.gerenciaAgendamentoService.checkMatrizEncaixeExiste(gerencia);

    if (matrizEncaixeExiste) {
      for await (const diaDiposnivel of this.getProximosDiasDisponiveisByGerencia(
        gerencia,
        inicioReferencia,
        maxOffset,
      )) {
        return diaDiposnivel;
      }
    }

    throw new NotFoundException(
      `Não foi possível encontrar um dia livre nos proximos ${maxOffset} dias.`,
    );
  }
}
