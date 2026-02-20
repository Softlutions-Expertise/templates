import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import { getPMap } from '../../../helpers/p-map';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ArquivoService } from '../../../infrastructure/arquivo/arquivo.service';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import { ContatoService } from '../../base/services/contato.service';
import { EnderecoService } from '../../base/services/endereco.service';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import { CreateEscolaDto } from '../dto/create-escola.dto';
import { UpdateEscolaDto } from '../dto/update-escola.dto';
import { SituacaoFuncionamento } from '../entities/enums/escola.enum';
import { EscolaEntity } from '../entities/escola.entity';
import { VagaEntity } from '../entities/vaga.entity';

export type IMappedEscola = Record<string, any> &
  EscolaEntity & {
    resumoVagas:
    | undefined
    | { anoLetivo: number; vagasLivres: number; vagasOcupadas: number }[];
  };

@Injectable()
export class EscolaService {
  constructor(
    @Inject('ESCOLA_REPOSITORY')
    private repository: Repository<EscolaEntity>,
    private readonly enderecoService: EnderecoService,
    private readonly contatoService: ContatoService,
    private readonly arquivoService: ArquivoService,
    private readonly databaseContextService: DatabaseContextService,
  ) { }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<EscolaEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'escola:read',
        this.repository.createQueryBuilder('escola'),
        id,
      );
    }

    const entity = await this.repository.findOne({
      where: { id },
      relations: [
        'endereco',
        'contato',
        'documentos',
        'horariosFuncionamento',
        'secretariaMunicipal',
        'turmas',
        'turmas.etapa',
      ],
    });

    if (!entity) {
      throw new NotFoundException(`Escola não encontrada`);
    }

    // Adiciona apelidos nas etapas das turmas
    if (entity.turmas && entity.turmas.length > 0) {
      const etapaIds = [
        ...new Set(
          entity.turmas.map((turma) => turma.etapa?.id).filter(Boolean),
        ),
      ];

      if (etapaIds.length > 0) {
        const apelidosQuery = await this.databaseContextService.dataSource
          .createQueryBuilder()
          .select('sme.etapa_id', 'etapaId')
          .addSelect('sme.apelido', 'apelido')
          .from('secretaria_municipal_etapa', 'sme')
          .where('sme.secretaria_municipal_id = :secretariaId', {
            secretariaId: entity.secretariaMunicipal.id,
          })
          .andWhere('sme.etapa_id IN (:...etapaIds)', { etapaIds })
          .getRawMany();

        const apelidosMap = new Map();
        apelidosQuery.forEach((row) => {
          apelidosMap.set(row.etapaId, row.apelido);
        });

        entity.turmas = entity.turmas.map((turma) => {
          if (turma.etapa) {
            (turma.etapa as any).apelido = apelidosMap.get(turma.etapa.id) || null;
          }
          return turma;
        });
      }
    }

    return entity;
  }

  async findAllWithQuantVagas(
    acessoControl: AcessoControl,
    secretariaMunicipalId: string | null,
    vagaAtiva = true,
    limit = 20,
    page = 1,
  ): Promise<Paginated<any>> {
    const qb = this.repository.createQueryBuilder('escola');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'escola:read',
      qb,
    );

    limit = Number(limit);
    page = Number(page);

    qb.select('escola.id', 'id')
      .addSelect('escola.nome_fantasia')
      .addSelect('COUNT(vaga.id)', 'quantidade_vagas_abertas')
      .innerJoin(
        VagaEntity,
        'vaga',
        'vaga.escola_id = escola.id AND vaga.ativa = :ativa',
        { ativa: vagaAtiva },
      );
    if (secretariaMunicipalId) {
      qb.innerJoin(
        SecretariaMunicipalEntity,
        'secretaria_municipal',
        'escola.secretaria_municipal_id = secretaria_municipal.id',
      );
      qb.andWhere('secretaria_municipal.id = :secretariaId', {
        secretariaId: secretariaMunicipalId,
      });
    }

    qb.groupBy('escola.id')
      .addGroupBy('escola.nome_fantasia')
      .orderBy('quantidade_vagas_abertas', 'DESC');

    const totalItems = await qb.getCount();
    const totalPages = Math.ceil(totalItems / limit);
    const result = await qb
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany()
      .catch(() => []);

    const paramsObj = {
      page: `${page}`,
      limit: `${limit}`,
    };
    if (vagaAtiva) {
      paramsObj['filter.vagaAtiva'] = `${vagaAtiva}`;
    }
    if (secretariaMunicipalId) {
      paramsObj['filter.secretariaMunicipal.id'] = `${secretariaMunicipalId}`;
    }
    const params = new URLSearchParams(paramsObj);
    const nextParams = new URLSearchParams(params.toString());
    if (page < totalPages) {
      nextParams.set('page', `${page + 1}`);
    }
    const lastParams = new URLSearchParams(params.toString());
    if (page > 1) {
      lastParams.set('page', `${page - 1}`);
    }

    return {
      data: result,
      meta: {
        search: '',
        select: [],
        sortBy: [],
        searchBy: [],
        totalPages: totalPages,
        currentPage: page,
        totalItems: totalItems,
        itemsPerPage: limit,
      },
      links: {
        current: `/escola/quantidade-vagas?${params.toString()}`,
        next:
          page < totalPages
            ? `/escola/quantidade-vagas?${nextParams.toString()}`
            : null,
        last:
          page > 1 ? `/escola/quantidade-vagas?${lastParams.toString()}` : null,
      },
    } satisfies Paginated<any>;
  }

  async findAllByCidade(
    acessoControl: AcessoControl,
    idCidade: number,
  ): Promise<EscolaEntity[]> {
    const entity = await this.repository.find({
      where: {
        id: await acessoControl.getReachableTargetsTypeorm(
          'escola:read',
          this.repository.createQueryBuilder('escola'),
        ),

        endereco: {
          cidade: {
            id: idCidade,
          },
        },
      },

      relations: ['endereco'],
    });

    if (!entity) {
      throw new NotFoundException(
        `Nenhuma escola encontrada para a cidade ${idCidade}`,
      );
    }

    return entity;
  }

  // Rota esta pública no BaseAuthzPolicy
  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
  ): Promise<Paginated<IMappedEscola>> {
    const qb = this.repository.createQueryBuilder('escola');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'escola:read',
      qb,
    );

    const vinculadoFila = query?.filter?.vinculadoFila;
    const anoLetivo = query?.filter?.anoLetivo;

    if (vinculadoFila === 'true' || vinculadoFila === 'false') {
      const negate = vinculadoFila === 'false';

      qb.andWhere(
        `${negate ? 'NOT' : ''} EXISTS (
          SELECT 
            entrevista.id 
          FROM entrevista
          LEFT JOIN reserva_vaga ON reserva_vaga.entrevista_id = entrevista.id
          WHERE (
            entrevista.elegivel_para_fila = TRUE
            AND reserva_vaga.id IS NULL
            AND
            (
              entrevista.preferencia_unidade = escola.id
              OR 
              entrevista.preferencia_unidade2 = escola.id
            )
            ${anoLetivo ? `AND entrevista.ano_letivo = :anoLetivo` : ''}
            AND entrevista.ano_letivo >= :anoAtual
          )
          LIMIT 1
        )`,
        {
          ...(anoLetivo ? { anoLetivo } : {}),
          anoAtual: new Date().getFullYear(),
        },
      );
    }

    const paginatedResults = await paginate(query, qb, {
      ...paginateConfig,
      defaultSortBy: [
        ['situacaoFuncionamento', 'ASC'],
        ['dataCriacao', 'DESC']
      ],
      relations: [
        'endereco',
        'endereco.cidade',
        'secretariaMunicipal',
        'turmas',
        'turmas.etapa',
      ],
      searchableColumns: [
        'razaoSocial',
        'nomeFantasia',
        'cnpjEscola',
        'secretariaMunicipal.nomeFantasia',
        'secretariaMunicipal.razaoSocial',
        'endereco.cidade.nome',
      ],
      filterableColumns: {
        id: [FilterOperator.IN],
        situacaoFuncionamento: [FilterOperator.EQ],
        'endereco.cidade.id': [FilterOperator.EQ],
        'secretariaMunicipal.id': [FilterOperator.EQ],
        'turmas.situacao': [FilterOperator.EQ],
        'turmas.etapa.id': [FilterOperator.EQ],
        'turmas.anoLetivo': [FilterOperator.EQ],
      },
    });

    const pMap = await getPMap();

    const mappedData = await pMap(paginatedResults.data, async (escola) => {
      const mappedEscola = {
        ...escola,
        resumoVagas: undefined,
      } as IMappedEscola;

      const verTurnos = query?.filter?.verTurnos;
      const verEtapas = query?.filter?.verEtapas;
      const verVagas = query?.filter?.verVagas;

      if (mappedEscola.turmas) {
        // Busca os apelidos das etapas se verEtapas for true
        if (verEtapas === 'true') {
          const etapaIds = [
            ...new Set(
              mappedEscola.turmas
                .map((turma) => turma.etapa?.id)
                .filter(Boolean),
            ),
          ];

          if (etapaIds.length > 0) {
            // Busca os apelidos das etapas para esta escola
            const apelidosQuery = await this.databaseContextService.dataSource
              .createQueryBuilder()
              .select('sme.etapa_id', 'etapaId')
              .addSelect('sme.apelido', 'apelido')
              .from('secretaria_municipal_etapa', 'sme')
              .where('sme.secretaria_municipal_id = :secretariaId', {
                secretariaId: escola.secretariaMunicipal.id,
              })
              .andWhere('sme.etapa_id IN (:...etapaIds)', { etapaIds })
              .getRawMany();

            const apelidosMap = new Map();
            apelidosQuery.forEach((row) => {
              apelidosMap.set(row.etapaId, row.apelido);
            });

            // Adiciona o apelido nas etapas das turmas
            mappedEscola.turmas = mappedEscola.turmas.map((turma) => {
              if (turma.etapa) {
                (turma.etapa as any).apelido =
                  apelidosMap.get(turma.etapa.id) || null;
              }
              return turma;
            });
          }
        }

        // Retorna os turnos disponíveis na escola
        if (verTurnos !== 'true') {
          delete mappedEscola.turnos;
        }

        if (verEtapas !== 'true') {
          delete mappedEscola.etapas;
        }

        delete mappedEscola.turmas;
      }

      if (verVagas === 'true') {
        const vagasQb =
          this.databaseContextService.vagaRepository.createQueryBuilder('vaga');

        vagasQb.groupBy('vaga.anoLetivo');

        vagasQb.select('vaga.anoLetivo', 'anoLetivo');

        vagasQb.addSelect(
          'COUNT(1) FILTER (WHERE vaga.ativa = TRUE)',
          'vagasLivres',
        );

        vagasQb.addSelect(
          'COUNT(1) FILTER (WHERE vaga.ativa = FALSE)',
          'vagasOcupadas',
        );

        vagasQb.innerJoin('vaga.escola', 'escola');

        vagasQb.where('escola.id = :escolaId', { escolaId: escola.id });

        const results = await vagasQb.getRawMany();

        mappedEscola.resumoVagas = results.map((vaga) => ({
          anoLetivo: +vaga.anoLetivo,
          vagasLivres: +vaga.vagasLivres,
          vagasOcupadas: +vaga.vagasOcupadas,
        }));
      }

      return mappedEscola;
    });

    return {
      ...paginatedResults,
      data: mappedData,
    };
  }

  async create(acessoControl: AcessoControl, data: CreateEscolaDto) {
    data.cnpjEscola = data.cnpjEscola?.replace(/\D/g, '');

    await acessoControl.ensureCanPerform('escola:create', data);

    const { endereco, contato, documentos, horariosFuncionamento, ...entity } =
      data;

    const _endereco = await this.enderecoService.createOrUpdate(endereco);
    const _contato = await this.contatoService.createOrUpdate(contato);

    const novaEscola = this.repository.create({
      ...entity,
      id: uuidv4(),
      endereco: _endereco,
      contato: _contato,
      documentos: documentos,
      horariosFuncionamento: horariosFuncionamento,
    });

    if (data.foto) {
      const accessToken =
        await this.arquivoService.uploadSchoolPictureFromBase64(
          acessoControl,
          novaEscola.id,
          data.foto,
        );

      data.foto = accessToken;
    }

    return this.repository.save(novaEscola);
  }

  async update(
    acessoControl: AcessoControl,
    id: string,
    data: UpdateEscolaDto,
  ) {
    let { endereco, contato, documentos, horariosFuncionamento, ...entity } =
      await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'escola:update',
      this.repository.createQueryBuilder('escola'),
      id,
      data,
    );

    if (data.foto) {
      const accessToken =
        await this.arquivoService.uploadSchoolPictureFromBase64(
          acessoControl,
          entity.id,
          data.foto,
        );

      data.foto = accessToken;
    }

    if (data.endereco !== undefined)
      endereco = await this.enderecoService.createOrUpdate(
        data.endereco,
        endereco?.id,
      );

    if (data.contato !== undefined)
      contato = await this.contatoService.createOrUpdate(data, contato?.id);

    entity = await this.repository.preload({
      id,
      ...data,
      endereco,
      contato,
    });

    return this.repository.save(entity);
  }

  async updateSituacaoFuncionamento(id: string) {
    const escola = await this.repository.findOne({
      where: { id, situacaoFuncionamento: SituacaoFuncionamento.desativada },
    });

    if (escola) {
      const entity = await this.repository.preload({
        id,
        ...escola,
        situacaoFuncionamento: SituacaoFuncionamento.ativa,
      });

      return this.repository.save(entity);
    }
  }

  async remove(acessoControl: AcessoControl, id: string) {
    return this.repository.remove(await this.findOne(acessoControl, id));
  }
}
