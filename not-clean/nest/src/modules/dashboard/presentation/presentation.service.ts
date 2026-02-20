import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import PQueue from 'p-queue';
import { Readable } from 'stream';
import { IMaybeString } from '../../../helpers/typings';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import {
  FilaService,
  MappedLastFila,
} from '../../fila/fila.service';
import { PresentationCountersService } from './counters/presentation-counters.service';

const getReferenceDate = () => {
  const now = new Date();
  return `${format(now, 'yyyy-MM-dd')}T04:00:00.000Z`;
};

function getCurrentYear(): any {
  return new Date().getFullYear();
}

class RequestQueueController {
  constructor(private queriesQueue: PQueue) { }

  #requestQueue = new PQueue({ concurrency: 7 });

  addQueryJob<T>(
    task: () => Promise<T>,
    { expensive = false }: { expensive?: boolean } = {},
  ) {
    return this.#requestQueue.add(
      () => {
        return this.queriesQueue.add(task, {
          priority: expensive ? 0 : 10,
        });
      },
      {
        priority: expensive ? 0 : 10,
      },
    );
  }
}

@Injectable()
export class PresentationService {
  #queriesQueue = new PQueue({ concurrency: 250 });

  createRequestQueueController() {
    return new RequestQueueController(this.#queriesQueue);
  }

  constructor(
    private filaService: FilaService,
    private presentationCountersService: PresentationCountersService,
  ) { }

  getReferenceContext() {
    return {
      referenceDate: getReferenceDate(),
      referenceYear: getCurrentYear(),
    };
  }

  async getCountersProfileAgendamentos(
    acessoControl: AcessoControl,
    secretariaId: IMaybeString,
    escolaId: IMaybeString,
    localAtendimentoId: IMaybeString,
  ) {
    const resolvedProfile = await AcessoControl.resolveProfile(
      acessoControl,
      secretariaId,
      escolaId,
      localAtendimentoId,
    );

    const { targetSecretariasMunicipaisId, targetLocaisAtendimentosIds } = resolvedProfile;

    const { referenceDate } = this.getReferenceContext();

    return this.presentationCountersService.getCountersAgendamentos(
      acessoControl,
      targetSecretariasMunicipaisId,
      targetLocaisAtendimentosIds,
      referenceDate,
    );
  }

  async getCountersProfileFilasDeEspera(
    acessoControl: AcessoControl,
    secretariaId: IMaybeString,
    escolaId: IMaybeString,
  ) {
    const resolvedProfile = await AcessoControl.resolveProfile(
      acessoControl,
      secretariaId,
      escolaId,
    );

    const { targetSecretariasMunicipaisId, targetEscolasIds } = resolvedProfile;

    const { referenceYear } = this.getReferenceContext();

    return this.presentationCountersService.getCountersFilasDeEspera(
      acessoControl,
      targetSecretariasMunicipaisId,
      targetEscolasIds,
      referenceYear,
    );
  }

  async getCountersProfileVagas(
    acessoControl: AcessoControl,
    secretariaId: IMaybeString,
    escolaId: IMaybeString,
  ) {
    const resolvedProfile = await AcessoControl.resolveProfile(
      acessoControl,
      secretariaId,
      escolaId,
    );

    const { targetSecretariasMunicipaisId, targetEscolasIds } = resolvedProfile;

    const { referenceYear } = this.getReferenceContext();

    return this.presentationCountersService.getCountersVagas(
      acessoControl,
      targetSecretariasMunicipaisId,
      targetEscolasIds,
      referenceYear,
    );
  }

  async getCountersProfileReservas(
    acessoControl: AcessoControl,
    secretariaId: IMaybeString,
    escolaId: IMaybeString,
  ) {
    const resolvedProfile = await AcessoControl.resolveProfile(
      acessoControl,
      secretariaId,
      escolaId,
    );

    const { targetSecretariasMunicipaisId, targetEscolasIds } = resolvedProfile;

    const { referenceYear } = this.getReferenceContext();

    return this.presentationCountersService.getCountersReservas(
      acessoControl,
      targetSecretariasMunicipaisId,
      targetEscolasIds,
      referenceYear,
    );
  }

  async getPresentationFilaPosicoesVinculadasProfile(
    requestQueueController: RequestQueueController,
    acessoControl: AcessoControl,
    //
    secretariaId?: IMaybeString,
    escolaId?: IMaybeString,
    //
    page: any = 1,
    limit: any = 20,
  ) {
    return requestQueueController.addQueryJob(async () => {
      const { targetSecretariasMunicipaisId, targetEscolasIds } =
        await AcessoControl.resolveProfile(
          acessoControl,
          secretariaId,
          escolaId,
        );

      let consideredPage = 1;
      let consideredLimit = 20;

      if (Number.isSafeInteger(+limit)) {
        consideredLimit = Math.max(Math.min(+limit, 100), 1);
      }

      if (Number.isSafeInteger(+page)) {
        consideredPage = Math.max(page, 1);
      }

      const consideredOffset = (consideredPage - 1) * consideredLimit;

      const qb = await this.filaService.prepareLastFilasQueryBuilder(
        targetSecretariasMunicipaisId,
        targetEscolasIds,
        { year: getCurrentYear(), compare: '>=' },
      );


      qb.limit(consideredLimit);
      qb.offset(consideredOffset);

      const results = await this.filaService.getMappedLastFilasByQueryBuilder(qb);
      const total = await qb.getCount();

      // Busca os apelidos separadamente se houver resultados
      if (results.length > 0) {
        await this.addApelidosToFilaResults(results, targetSecretariasMunicipaisId);
      }

      const totalPages = Math.ceil(total / consideredLimit);

      const paginated = {
        data: results,
        meta: {
          itemsPerPage: consideredLimit,
          totalItems: total,
          currentPage: consideredPage,
          totalPages: totalPages,
          sortBy: [],
        },
      };

      return paginated;
    });
  }

  // Método helper simplificado para buscar apelidos
  private async addApelidosToFilaResults(results: any[], secretariasIds?: string[] | null) {
    if (!results.length) return;

    // Extrai IDs únicos das etapas e secretarias dos resultados
    const etapaIds = [...new Set(results.map(result => result.etapa?.id).filter(Boolean))];
    const secretariaIdsFromResults = [...new Set(results.map(result => result.secretariaMunicipal?.id).filter(Boolean))];

    // Usa os IDs de secretarias passados como parâmetro ou extraídos dos resultados
    const finalSecretariaIds = secretariasIds?.length ? secretariasIds : secretariaIdsFromResults;

    if (!etapaIds.length || !finalSecretariaIds.length) return;

    try {
      // Usa o método do FilaService para buscar apelidos
      const apelidos = await this.filaService.getApelidosEtapas(finalSecretariaIds, etapaIds);

      // Adiciona os apelidos nos resultados
      results.forEach(result => {
        if (result.etapa && result.secretariaMunicipal) {
          const key = `${result.secretariaMunicipal.id}-${result.etapa.id}`;
          result.etapa.apelido = apelidos.get(key) || null;
        }
      });
    } catch (error) {
      console.error('Erro ao buscar apelidos das etapas:', error);
      // Em caso de erro, continua sem os apelidos
      results.forEach(result => {
        if (result.etapa) {
          result.etapa.apelido = null;
        }
      });
    }
  }



  async getPresentationFilaPosicoes(
    requestQueueController: RequestQueueController,

    secretariasIds?: string[] | null,
    escolasIds?: string[] | null,
    page: any = 1,
    limit: any = 20,
  ) {
    return requestQueueController.addQueryJob(async () => {
      //

      let consideredPage = 1;
      let consideredLimit = 20;

      if (Number.isSafeInteger(+limit)) {
        consideredLimit = Math.max(Math.min(+limit, 100), 1);
      }

      if (Number.isSafeInteger(+page)) {
        consideredPage = Math.max(page, 1);
      }

      const consideredOffset = (consideredPage - 1) * consideredLimit;

      //

      const qb = await this.filaService.prepareLastFilasQueryBuilder(
        secretariasIds,
        escolasIds,
        { year: getCurrentYear(), compare: '>=' },
      );

      //
      qb.limit(consideredLimit);
      qb.offset(consideredOffset);
      //

      const results = await this.filaService.getMappedLastFilasByQueryBuilder(
        qb,
      );

      //

      const total = await qb.getCount();
      const totalPages = Math.ceil(total / consideredLimit);

      //

      const paginated = {
        data: results,

        meta: {
          itemsPerPage: consideredLimit,
          totalItems: total,
          currentPage: consideredPage,
          totalPages: totalPages,
          sortBy: [],
        },
      };

      return paginated;
    });
  }

  async getPresentationFilaPosicoesVinculadasCsvProfile(
    requestQueueController: RequestQueueController,
    acessoControl: AcessoControl,
    secretariaId?: IMaybeString,
    escolaId?: IMaybeString,
  ) {
    const { targetSecretariasMunicipaisId, targetEscolasIds } =
      await AcessoControl.resolveProfile(acessoControl, secretariaId, escolaId);

    return this.getPresentationFilaPosicoesVinculadasCsv(
      requestQueueController,
      targetSecretariasMunicipaisId,
      targetEscolasIds,
    );
  }

  async getPresentationFilaPosicoesVinculadasCsv(
    requestQueueController: RequestQueueController,
    secretariasIds?: string[] | null,
    escolasIds?: string[] | null,
  ) {
    const sep = ';';

    const fields = [
      {
        key: 'secretaria_nome_fantasia',
        value: (row: MappedLastFila) => row.secretariaMunicipal.nomeFantasia,
      },
      {
        key: 'escola_nome_fantasia',
        value: (row: MappedLastFila) => row.escola.nomeFantasia,
      },
      {
        key: 'etapa_nome',
        value: (row: MappedLastFila) => row.etapa.nome,
      },
      {
        key: 'turno_nome',
        value: (row: MappedLastFila) => row.turno.nome,
      },
      {
        key: 'fila_created_at',
        value: (row: MappedLastFila) =>
          new Date(row.fila.createdAt).toISOString(),
      },
      {
        key: 'fila_quantidade_criancas',
        value: (row: MappedLastFila) => row.quantidadeCriancas,
      },
    ];

    const generateCsvLines = async function* (this: PresentationService) {
      yield fields.map((field) => field.key).join(sep);

      let page = 1;
      let totalPages = 0;

      do {
        const response = await this.getPresentationFilaPosicoes(
          requestQueueController,
          secretariasIds,
          escolasIds,
          page,
        );

        for (const fila of response.data) {
          yield '\n';
          yield fields.map((field) => field.value(fila)).join(sep);
        }

        page++;
        totalPages = response.meta.totalPages;
      } while (page <= totalPages);
    };

    return {
      stream: Readable.from(generateCsvLines.call(this)),
      escolasIds,
      secretariasIds,
    };
  }
}
