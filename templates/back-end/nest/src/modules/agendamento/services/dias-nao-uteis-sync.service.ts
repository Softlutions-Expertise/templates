import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import PQueue from 'p-queue';
import { Brackets } from 'typeorm';
import {
  DIAS_NAO_UTEIS_NACIONAIS,
  ENABLE_SYNC_FERIADOS_TICK,
  logDebug,
} from '../../../config/options';
import eventBus from '../../../helpers/eventEmitter.helper';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import { CidadeEntity } from '../../base/entities/cidade.entity';
import { FeriadosService } from '../../feriados/feriados.service';
import { FeriadoEntity } from '../entities/feriado.entity';
import { GerenciaAgendamentoEntity } from '../entities/gerencia-agendamento.entity';
import { GerenciaAgendamentoService } from './gerencia-agendamentos.service';

@Injectable()
export class DiasNaoUteisSyncService implements OnApplicationBootstrap {
  queue = new PQueue({ concurrency: 1, interval: 1000 });

  constructor(
    private databaseContextService: DatabaseContextService,
    private feriadosService: FeriadosService,
    private gerenciaAgendamentoService: GerenciaAgendamentoService,
  ) { }

  //

  get diaNaoUtilRepostiory() {
    return this.databaseContextService.diaNaoUtilRepository;
  }

  //

  async onApplicationBootstrap() {
    eventBus.on('syncDiasNaoUteis', () => {
      this.syncDiasNaoUteis();
    });

    this.syncDiasNaoUteisTick();
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async syncDiasNaoUteisTick() {
    if (ENABLE_SYNC_FERIADOS_TICK) {
      await this.syncDiasNaoUteis();
    }
  }

  async addDiasNaoUteis(
    feriados: AsyncIterable<FeriadoEntity> | Iterable<FeriadoEntity>,
    gerenciaAgendamentoId: GerenciaAgendamentoEntity['id'] | null,
  ) {
    if (gerenciaAgendamentoId === null && !DIAS_NAO_UTEIS_NACIONAIS) {
      throw new Error(
        'gerenciaAgendamentoId não pode ser nulo porque NACIONAIS = false',
      );
    }

    for await (const feriado of feriados) {
      const data = new Date(`${feriado.data.slice(0, 10)}T00:00:00.00Z`);

      const qb = this.diaNaoUtilRepostiory.createQueryBuilder('diaNaoUtil');

      qb.where('diaNaoUtil.tituloFeriado = :titulo', {
        titulo: feriado.titulo,
      });

      qb.andWhere(
        'CAST(diaNaoUtil.dataFeriado as DATE) = CAST(:data as DATE)',
        { data: data },
      );

      qb.leftJoin('diaNaoUtil.gerenciaAgendamento', 'gerenciaAgendamento');

      qb.andWhere(
        new Brackets((qb) => {
          if (gerenciaAgendamentoId) {
            qb.where('gerenciaAgendamento.id = :gerenciaAgendamentoId', {
              gerenciaAgendamentoId,
            });

            qb.orWhere('gerenciaAgendamento.id IS NULL');
          } else {
            qb.where('gerenciaAgendamento.id IS NULL');
          }
        }),
      );

      const exists = await qb.getExists();

      if (exists) {
        continue;
      }

      const diaNaoUtil = this.diaNaoUtilRepostiory.create();

      this.diaNaoUtilRepostiory.merge(diaNaoUtil, {
        ativo: true,

        tituloFeriado: feriado.titulo,
        dataFeriado: data,

        gerenciaAgendamento: gerenciaAgendamentoId
          ? { id: gerenciaAgendamentoId }
          : null,
      });

      await this.diaNaoUtilRepostiory.save(diaNaoUtil);
    }
  }

  async syncDiasNaoUteis() {
    return this.queue.add(async () => {
      try {
        return await this.syncDiasNaoUteisCore();
      } catch (err) {
        console.error(
          `-> não foi possível realizar ${this.syncDiasNaoUteisTick.name}`,
        );
        // console.trace(err);
      }
    });
  }

  private async syncDiasNaoUteisCore() {
    const generateYears = function* () {
      const currentYear = new Date().getFullYear();

      const yearsCount = 5;

      for (let offset = 0; offset < yearsCount; offset++) {
        yield currentYear + offset;
      }
    };

    const anos = Array.from(generateYears());

    logDebug(`-> ${this.syncDiasNaoUteisCore.name}(${anos.join(', ')})`);

    for (const ano of anos) {
      await this.syncDiasNaoUteisAno(ano);
    }
  }

  async syncDiasNaoUteisAno(ano: number) {
    logDebug(`-> [sync / dias nao uteis / ${ano}]`);

    await this.syncDiasNaoUteisNacionaisAno(ano);
    await this.syncDiasNaoUteisCidadesAno(ano);
  }

  async syncDiasNaoUteisNacionaisAno(ano: number) {
    if (!DIAS_NAO_UTEIS_NACIONAIS) {
      return;
    }

    logDebug(`-> [sync / dias nao uteis / ${ano} / nacional]`);

    const feriados = await this.feriadosService.syncFeriadosRecursivo(
      ano,
      null,
      null,
    );

    await this.addDiasNaoUteis(feriados, null);
  }

  async syncDiasNaoUteisCidadesAno(ano: number) {
    logDebug(`-> [sync / dias nao uteis / ${ano} / cidades`);

    const cidades = await this.getCidadesAtivas();

    for (const cidade of cidades) {
      await this.syncDiasNaoUteisCidadeAno(ano, cidade.id);
    }
  }

  async syncDiasNaoUteisGerenciaAgendamento(
    ano: number,
    idGerenciaAgendamento: GerenciaAgendamentoEntity['id'],
  ) {
    const idCidade = await this.getCidadeIdByIdGerenciaAgendamento(
      idGerenciaAgendamento,
    );

    if (!idCidade) {
      return false;
    }

    const cidade = await this.databaseContextService.cidadeRepository.findOne({
      where: { id: idCidade },
      relations: ['estado'],
    });

    logDebug(
      `-> [sync / dias nao uteis / ${ano} / cidades / ${idCidade} ] // ${cidade.nome} - ${cidade.estado.uf}`,
    );

    const feriadosCidade = await this.feriadosService.syncFeriadosRecursivo(
      ano,
      cidade.estado.id,
      cidade.id,
    );

    const gerenciaAgendamento = await this.gerenciaAgendamentoService.findOne(
      null,
      idGerenciaAgendamento,
    );

    await this.addDiasNaoUteis(feriadosCidade, gerenciaAgendamento.id);

    await this.gerenciaAgendamentoService.rescheduleAgendamentos(
      null,
      gerenciaAgendamento.localAtendimento.secretariaMunicipal.id,
    );
  }

  async syncDiasNaoUteisCidadeAno(ano: number, idCidade: CidadeEntity['id']) {
    const cidade = await this.databaseContextService.cidadeRepository.findOne({
      where: { id: idCidade },
      relations: ['estado'],
    });

    logDebug(
      `-> [sync / dias nao uteis / ${ano} / cidades / ${idCidade} ] // ${cidade.nome} - ${cidade.estado.uf}`,
    );

    const feriadosCidade = await this.feriadosService.syncFeriadosRecursivo(
      ano,
      cidade.estado.id,
      cidade.id,
    );

    const gerenciasAgendamentos = await this.getGerenciasAgendamentosByCidadeId(
      cidade.id,
    );

    for (const { id: idGerenciaAgendamento } of gerenciasAgendamentos) {
      const gerenciaAgendamento = await this.gerenciaAgendamentoService.findOne(
        null,
        idGerenciaAgendamento,
      );

      await this.addDiasNaoUteis(feriadosCidade, gerenciaAgendamento.id);

      await this.gerenciaAgendamentoService.rescheduleAgendamentos(
        null,
        gerenciaAgendamento.localAtendimento.secretariaMunicipal.id,
      );
    }
  }

  //

  private async getCidadesAtivas() {
    const { cidadeRepository } = this.databaseContextService;

    const qb = cidadeRepository.createQueryBuilder('cidade');

    qb.innerJoin('cidade.enderecos', 'endereco');
    qb.innerJoin('endereco.secretariasMunicipais', 'secretaria');
    qb.innerJoin('secretaria.locaisAtendimentos', 'localAtendimento');
    qb.innerJoin('localAtendimento.gerenciaAgendamento', 'gerenciaAgendamento');

    qb.select(['cidade.id', 'cidade.nome']);

    const cidades = await qb.getMany();

    return cidades;
  }

  private async getGerenciasAgendamentosByCidadeId(
    idCidade: CidadeEntity['id'],
  ) {
    const { gerenciaAgendamentoRepository } = this.databaseContextService;

    const qb = gerenciaAgendamentoRepository.createQueryBuilder(
      'gerenciaAgendamento',
    );

    qb.innerJoin('gerenciaAgendamento.localAtendimento', 'localAtendimento');
    qb.innerJoin('localAtendimento.secretariaMunicipal', 'secretaria');
    qb.innerJoin('secretaria.endereco', 'endereco');
    qb.innerJoin('endereco.cidade', 'cidade');
    qb.where('cidade.id = :idCidade', { idCidade: idCidade });

    const gerenciasAgendamentos = await qb.getMany();

    return gerenciasAgendamentos as Pick<GerenciaAgendamentoEntity, 'id'>[];
  }

  private async getCidadeIdByIdGerenciaAgendamento(
    idGerenciaAgendamento: GerenciaAgendamentoEntity['id'],
  ) {
    const { cidadeRepository } = this.databaseContextService;

    const qb = cidadeRepository.createQueryBuilder('cidade');

    qb.innerJoin('cidade.enderecos', 'endereco');
    qb.innerJoin('endereco.secretariasMunicipais', 'secretaria');
    qb.innerJoin('secretaria.locaisAtendimentos', 'localAtendimento');
    qb.innerJoin('localAtendimento.gerenciaAgendamento', 'gerenciaAgendamento');

    qb.select(['cidade.id']);

    qb.where('gerenciaAgendamento.id = :idGerenciaAgendamento', {
      idGerenciaAgendamento,
    });

    const cidade = await qb.getOne();

    return cidade?.id ?? null;
  }

  //
}
