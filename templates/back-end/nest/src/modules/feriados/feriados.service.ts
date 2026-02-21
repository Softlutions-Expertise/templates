import { Injectable } from '@nestjs/common';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { FilterComparator } from 'nestjs-paginate/lib/filter';
import { Brackets } from 'typeorm';
import { v4 } from 'uuid';
import { logDebug } from '../../config/options';
import { paginateConfig } from '../../config/paginate.config';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../infrastructure/database-context/database-context.service';
import { FeriadoEntity } from '../agendamento/entities/feriado.entity';
import { CidadeEntity } from '../base/entities/cidade.entity';
import { EstadoEntity } from '../base/entities/estado.entity';
import { EstadoService } from '../base/services/estado.service';
import { SecretariaMunicipalEntity } from '../secretaria-municipal/entities/secretaria-municipal.entity';
import { CacheServiceIbge } from './helpers/cache/CacheServiceIbge';
import { IbgeService } from './helpers/ibge/ibge-service';
import { IHoliday } from './interfaces/IHoliday';
import { IHolidayExtractorService } from './interfaces/IHolidaysExtractorService';
import { FeriadosComBrService } from './sources/feriados_com_br/feriados-com-br.service';

@Injectable()
export class FeriadosService {
  holidayExtractorService: IHolidayExtractorService;

  constructor(
    private estadoService: EstadoService,
    private databaseContextService: DatabaseContextService,
  ) {
    const ibgeService = new IbgeService(new CacheServiceIbge());
    this.holidayExtractorService = new FeriadosComBrService({ ibgeService });
  }

  private get feriadoRepository() {
    return this.databaseContextService.feriadoRepository;
  }

  private get consultaFeriadosRepository() {
    return this.databaseContextService.consultaFeriadosRepository;
  }

  private async resolveEstadoCidade(
    idEstado: EstadoEntity['id'] | null,
    idCidade: CidadeEntity['id'] | null,
  ) {
    if (idCidade) {
      const cidadeRepository = this.databaseContextService.cidadeRepository;

      const qb = cidadeRepository.createQueryBuilder('cidade');

      qb.innerJoin('cidade.estado', 'estado');
      qb.where('cidade.id = :idCidade', { idCidade: idCidade });

      qb.select(['cidade', 'estado']);

      const cidade = await qb.getOne();

      const estado = await this.estadoService.findOne(cidade.estado.id);

      return {
        cidade,
        estado,
      };
    }

    if (idEstado) {
      const estado = await this.estadoService.findOne(idEstado);

      return {
        estado,
        cidade: null,
      };
    }

    return {
      cidade: null,
      estado: null,
    };
  }

  private async resolveEstadoCidadeIds(
    idEstado: EstadoEntity['id'] | null,
    idCidade: CidadeEntity['id'] | null,
  ): Promise<
    | { estadoId: null; cidadeId: null }
    | { estadoId: number; cidadeId: null }
    | { estadoId: number; cidadeId: number }
  > {
    const { estado, cidade } = await this.resolveEstadoCidade(
      idEstado,
      idCidade,
    );

    const estadoId = estado?.id ?? null;
    const cidadeId = cidade?.id ?? null;

    return {
      estadoId,
      cidadeId,
    };
  }

  private async puxarConsultaExistente(
    ano: number,
    idEstado: EstadoEntity['id'] | null,
    idCidade: CidadeEntity['id'] | null,
  ) {
    const { estadoId, cidadeId } = await this.resolveEstadoCidadeIds(
      idEstado,
      idCidade,
    );

    const qb =
      this.consultaFeriadosRepository.createQueryBuilder('consultaFeriados');

    qb.where('consultaFeriados.ano = :ano', { ano });

    qb.leftJoin('consultaFeriados.estado', 'estado');
    qb.leftJoin('consultaFeriados.cidade', 'cidade');

    if (estadoId) {
      qb.andWhere('estado.id = :estadoId', { estadoId });

      if (cidadeId) {
        qb.andWhere('cidade.id = :cidadeId', { cidadeId });
      } else {
        qb.andWhere('cidade.id IS NULL');
      }
    } else {
      qb.andWhere('estado.id IS NULL');
    }

    const consultaExistente = await qb.getOne();

    return consultaExistente;
  }

  async addFeriado(
    feriado: IHoliday,
    idEstado: EstadoEntity['id'] | null,
    idCidade: CidadeEntity['id'] | null,
  ) {
    const { estadoId, cidadeId } = await this.resolveEstadoCidadeIds(
      idEstado,
      idCidade,
    );

    const dataAlvo = new Date(feriado.date);

    const qb = this.feriadoRepository.createQueryBuilder('feriado');

    qb.where('feriado.titulo = :titulo', {
      titulo: feriado.name,
    });

    qb.andWhere('CAST(feriado.data AS DATE) = CAST(:dataAlvo AS DATE)', {
      dataAlvo: dataAlvo,
    });

    qb.leftJoin('feriado.estado', 'estado');

    qb.andWhere(
      new Brackets((qb) => {
        qb.where('estado.id IS NULL');

        if (estadoId) {
          qb.orWhere('estado.id = :estadoId', { estadoId });
        }
      }),
    );

    qb.leftJoin('feriado.cidade', 'cidade');

    qb.andWhere(
      new Brackets((qb) => {
        qb.where('cidade.id IS NULL');

        if (cidadeId) {
          qb.orWhere('cidade.id = :cidadeId', { cidadeId });
        }
      }),
    );

    const feriadoExistente = await qb.getExists();

    if (feriadoExistente) {
      return feriadoExistente;
    }

    logDebug(
      `-> [sync / feriados / add] (${feriado.date}, ${feriado.name}, ${estadoId}, ${cidadeId})`,
    );

    const novoFeriado = this.feriadoRepository.create({
      id: v4(),

      titulo: feriado.name,
      data: feriado.date.slice(0, 10),

      cidade: cidadeId ? { id: cidadeId } : null,
      estado: estadoId ? { id: estadoId } : null,
    });

    await this.feriadoRepository.save(novoFeriado);

    return novoFeriado;
  }

  async addFeriados(
    feriados: IHoliday[],
    idEstado: EstadoEntity['id'] | null,
    idCidade: CidadeEntity['id'] | null,
  ) {
    const { estadoId, cidadeId } = await this.resolveEstadoCidadeIds(
      idEstado,
      idCidade,
    );

    for (const feriado of feriados) {
      await this.addFeriado(feriado, estadoId, cidadeId);
    }
  }

  async getFeriadosExistentes(
    ano: number,
    idEstado: EstadoEntity['id'] | null,
    idCidade: CidadeEntity['id'] | null,
  ) {
    const { estadoId, cidadeId } = await this.resolveEstadoCidadeIds(
      idEstado,
      idCidade,
    );

    const qb = this.feriadoRepository.createQueryBuilder('feriado');

    qb.where('EXTRACT(YEAR from feriado.data::date) = :ano', { ano });

    qb.leftJoin('feriado.estado', 'estado');
    qb.leftJoin('feriado.cidade', 'cidade');

    qb.andWhere(
      new Brackets((qb) => {
        qb.where('estado.id IS NULL');

        if (estadoId) {
          qb.orWhere('estado.id = :estadoId', { estadoId });
        }
      }),
    );

    qb.andWhere(
      new Brackets((qb) => {
        qb.where('cidade.id IS NULL');

        if (cidadeId) {
          qb.orWhere('cidade.id = :cidadeId', { cidadeId });
        }
      }),
    );

    return qb.getMany();
  }

  async syncFeriadosEspecifico(
    ano: number,
    idEstado: EstadoEntity['id'] | null,
    idCidade: CidadeEntity['id'] | null,
  ) {
    const { estadoId, cidadeId } = await this.resolveEstadoCidadeIds(
      idEstado,
      idCidade,
    );

    logDebug(
      `-> [sync / feriados / especifico] (${ano}, ${estadoId}, ${cidadeId})`,
    );

    const consultaExistente = await this.puxarConsultaExistente(
      ano,
      estadoId,
      cidadeId,
    );

    if (!consultaExistente) {
      logDebug(
        `-> [sync / feriados / especifico] (${ano}, ${estadoId}, ${cidadeId}) - realizando nova consulta`,
      );

      const feriados = await this.holidayExtractorService.getHolidays(
        ano,
        estadoId,
        cidadeId,
      );

      await this.addFeriados(feriados, estadoId, cidadeId);

      const { consultaFeriadosRepository } = this.databaseContextService;

      const novaConsultaFeriado = consultaFeriadosRepository.create({
        id: v4(),

        ano,

        cidade: cidadeId ? { id: cidadeId } : null,
        estado: estadoId ? { id: estadoId } : null,
      });

      await consultaFeriadosRepository.save(novaConsultaFeriado);
    } else {
      logDebug(
        `-> [sync / feriados / especifico] (${ano}, ${estadoId}, ${cidadeId}) - consulta existente`,
      );
    }

    return this.getFeriadosExistentes(ano, estadoId, cidadeId);
  }

  async syncFeriadosRecursivo(
    ano: number,
    idEstado: EstadoEntity['id'] | null,
    idCidade: CidadeEntity['id'] | null,
  ) {
    const { estadoId, cidadeId } = await this.resolveEstadoCidadeIds(
      idEstado,
      idCidade,
    );

    logDebug(
      `-> [sync / feriados / recursivo] (${ano}, ${estadoId}, ${cidadeId})`,
    );

    await this.syncFeriadosEspecifico(ano, null, null);

    if (estadoId) {
      await this.syncFeriadosEspecifico(ano, estadoId, null);
    }

    if (estadoId && cidadeId) {
      await this.syncFeriadosEspecifico(ano, estadoId, cidadeId);
    }

    return this.getFeriadosExistentes(ano, estadoId, cidadeId);
  }

  private async resolveAtingeLocalizacao(options: {
    atingeEstado: EstadoEntity['id'] | null;
    atingeCidade: CidadeEntity['id'] | null;
    atingeSecretaria: SecretariaMunicipalEntity['id'] | null;
  }) {
    if (options.atingeSecretaria) {
      const qb =
        this.databaseContextService.cidadeRepository.createQueryBuilder(
          'cidade',
        );

      qb.innerJoin('cidade.estado', 'estado');

      qb.innerJoin('cidade.enderecos', 'endereco');
      qb.innerJoin('endereco.secretariasMunicipais', 'secretaria');

      qb.where('secretaria.id = :idSecretaria', {
        idSecretaria: options.atingeSecretaria,
      });

      qb.select(['cidade.id', 'estado.id']);

      const cidade = await qb.getOne();

      return this.resolveEstadoCidadeIds(cidade.estado.id, cidade.id);
    }

    return this.resolveEstadoCidadeIds(
      options.atingeEstado ?? null,
      options.atingeCidade ?? null,
    );
  }

  async findAll(
    acessoControl: AcessoControl | null,
    query: PaginateQuery,
    filters: {
      atingeAno: number;
      atingeEstado: EstadoEntity['id'] | null;
      atingeCidade: CidadeEntity['id'] | null;
      atingeSecretaria: SecretariaMunicipalEntity['id'] | null;
    },
  ): Promise<Paginated<FeriadoEntity>> {
    const { estadoId, cidadeId } = await this.resolveAtingeLocalizacao({
      atingeEstado: filters.atingeEstado,
      atingeCidade: filters.atingeCidade,
      atingeSecretaria: filters.atingeSecretaria,
    });

    await this.syncFeriadosRecursivo(filters.atingeAno, estadoId, cidadeId);

    const qb = this.feriadoRepository.createQueryBuilder('feriado');

    if (acessoControl) {
      await acessoControl.ensureCanPerform('feriado:read');
    }

    const { atingeAno } = filters;

    qb.andWhere('EXTRACT(YEAR from feriado.data::date) = :ano', {
      ano: atingeAno,
    });

    qb.leftJoin('feriado.estado', 'estado');
    qb.leftJoin('feriado.cidade', 'cidade');

    if (estadoId) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('estado.id IS NULL');
          qb.orWhere('estado.id = :estadoId', { estadoId: estadoId });
        }),
      );

      if (cidadeId) {
        qb.andWhere(
          new Brackets((qb) => {
            qb.where('cidade.id IS NULL');
            qb.orWhere('cidade.id = :cidadeId', { cidadeId: cidadeId });
          }),
        );
      }
    }

    return paginate(query, qb, {
      ...paginateConfig,
      sortableColumns: ['data'],

      relations: ['estado', 'cidade'],

      defaultSortBy: [
        ['data', 'ASC'],
        ['titulo', 'ASC'],
      ],

      searchableColumns: ['titulo'],

      filterableColumns: {
        id: [FilterOperator.IN, FilterSuffix.NOT],
        'estado.id': [
          FilterOperator.EQ,
          FilterOperator.NULL,
          FilterSuffix.NOT,
          FilterComparator.AND,
          FilterComparator.OR,
          FilterOperator.IN,
        ],
        'cidade.id': [
          FilterOperator.EQ,
          FilterOperator.NULL,
          FilterSuffix.NOT,
          FilterComparator.AND,
          FilterComparator.OR,
          FilterOperator.IN,
        ],
        data: [
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
}
