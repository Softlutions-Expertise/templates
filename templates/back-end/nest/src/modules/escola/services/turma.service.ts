import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { map } from 'lodash';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import { CreateTurmaDto } from '../dto/create-turma.dto';
import { UpdateTurmaDto } from '../dto/update-turma.dto';
import { TurmaEntity } from '../entities/turma.entity';
import { EscolaService } from './escola.service';
import { VagasService } from './vagas.service';

@Injectable()
export class TurmaService {
  constructor(
    @Inject('TURMA_REPOSITORY')
    private turmaRepository: Repository<TurmaEntity>,
    private vagasService: VagasService,
    private escolaService: EscolaService,

    private databaseContextService: DatabaseContextService,
  ) {}

  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
  ): Promise<Paginated<TurmaEntity>> {
    const qbAcesso = this.turmaRepository.createQueryBuilder('turma');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'turma:read',
      qbAcesso,
    );

    // Adiciona JOIN para buscar o apelido da etapa
    qbAcesso
      .leftJoin('turma.escola', 'escola')
      .leftJoin('escola.secretariaMunicipal', 'secretariaMunicipal')
      .leftJoin('turma.etapa', 'etapa')
      .leftJoin(
        'secretaria_municipal_etapa',
        'sme',
        'sme.secretaria_municipal_id = secretariaMunicipal.id AND sme.etapa_id = etapa.id'
      );

    const paginatedResult = await paginate(query, qbAcesso.clone(), {
      ...paginateConfig,
      defaultSortBy: [['id', 'DESC']],
      relations: ['escola.secretariaMunicipal', 'etapa'],
      searchableColumns: [
        'anoLetivo',
        'escola.nomeFantasia',
        'escola.razaoSocial',
        'turno',
        'nome',
      ],
      filterableColumns: {
        anoLetivo: [FilterOperator.EQ],
        situacao: [FilterOperator.EQ],
        'escola.id': [FilterOperator.EQ],
        'escola.secretariaMunicipal.id': [FilterOperator.EQ],
        turno: [FilterOperator.EQ],
        'etapa.id': [FilterOperator.EQ],
        'sme.apelido': [FilterOperator.EQ], // Permite filtrar pelo apelido
        'createdAt': [FilterOperator.BTW, FilterOperator.GT, FilterOperator.LT, FilterOperator.GTE, FilterOperator.LTE],
      },
      select: [
        'id',
        'anoLetivo',
        'turno',
        'nome',
        'createdAt',
        'updatedAt',
        'escola.nomeFantasia',
        'escola.razaoSocial',
        'situacao',
        'etapa.id',
        'etapa.nome',
      ],
    });

    const turmas = paginatedResult.data;

    if (turmas.length > 0) {
      const turmaIds = turmas.map((turma) => turma.id);

      // Busca os apelidos das etapas
      const apelidosMap = new Map();
      const apelidosQuery = await this.turmaRepository
        .createQueryBuilder('turma')
        .leftJoin('turma.escola', 'escola')
        .leftJoin('escola.secretariaMunicipal', 'secretariaMunicipal')
        .leftJoin('turma.etapa', 'etapa')
        .leftJoin(
          'secretaria_municipal_etapa',
          'sme',
          'sme.secretaria_municipal_id = secretariaMunicipal.id AND sme.etapa_id = etapa.id'
        )
        .select('turma.id', 'turmaId')
        .addSelect('sme.apelido', 'etapaApelido')
        .where('turma.id IN (:...ids)', { ids: turmaIds })
        .getRawMany();

      apelidosQuery.forEach(row => {
        apelidosMap.set(row.turmaId, row.etapaApelido);
      });

      const qb = this.turmaRepository
        .createQueryBuilder('turma')
        .addSelect([
          'COUNT(DISTINCT CASE WHEN vagas.ativa = :active THEN vagas.id END) AS vagasAtivas',
        ])
        .addSelect([
          'COUNT(DISTINCT CASE WHEN vagas.ativa = :inactive THEN vagas.id END) AS vagasInativas',
        ])
        .leftJoin('vagas', 'vagas', 'vagas.turma_id = turma.id')
        .groupBy('turma.id')
        .setParameter('active', true)
        .setParameter('inactive', false)
        .whereInIds(turmaIds);

      const result = await qb.getRawMany();

      const combinedData = turmas.map((turma) => {
        const matchingResult = result.find((row) => row.turma_id === turma.id);

        // Adiciona o apelido na etapa
        if (turma.etapa) {
          (turma.etapa as any).apelido = apelidosMap.get(turma.id) || null;
        }

        return {
          ...turma,
          vagasAtivas: matchingResult ? matchingResult.vagasativas : 0,
          vagasInativas: matchingResult ? matchingResult.vagasinativas : 0,
        };
      });

      paginatedResult.data = combinedData;
    }
    return paginatedResult;
  }

  async findOne(
    acessoControl: AcessoControl,
    id: string,
  ): Promise<TurmaEntity> {
    const allVagas = await this.vagasService.findAllVagas();

    const entity = await this.turmaRepository.findOne({
      where: { id },
      relations: ['etapa', 'escola', 'escola.secretariaMunicipal'],
    });

    await acessoControl.ensureCanReachTarget(
      'turma:read',
      this.turmaRepository.createQueryBuilder('turma'),
      id,
    );

    if (!entity) {
      throw new NotFoundException(`Turma não encontrada`);
    }

    // Busca o apelido da etapa
    if (entity.etapa && entity.escola?.secretariaMunicipal) {
      const apelidoQuery = await this.turmaRepository
        .createQueryBuilder()
        .select('sme.apelido', 'apelido')
        .from('secretaria_municipal_etapa', 'sme')
        .where('sme.secretaria_municipal_id = :secretariaId', { 
          secretariaId: entity.escola.secretariaMunicipal.id 
        })
        .andWhere('sme.etapa_id = :etapaId', { 
          etapaId: entity.etapa.id 
        })
        .getRawOne();

      if (apelidoQuery) {
        (entity.etapa as any).apelido = apelidoQuery.apelido;
      }
    }

    let vagasAtivas = 0;
    let vagasInativas = 0;
    allVagas.forEach((vaga) => {
      if (vaga.turma.id === entity.id) {
        if (vaga.ativa) {
          vagasAtivas++;
        } else {
          vagasInativas++;
        }
      }
    });

    const turma = {
      ...entity,
      vagasAtivas,
      vagasInativas,
    };
    return turma;
  }

  async findTurmasByCidade(citiId, etapaId?: string, secretariaId?: string) {
    const where: any = {
      escola: {
        endereco: { cidade: { id: citiId } },
        secretariaMunicipal: { id: secretariaId },
      },
      situacao: true,
    };

    if (etapaId) {
      where.etapa = { id: etapaId };
    }

    const turmas = await this.turmaRepository.find({
      where,
      relations: ['etapa', 'escola', 'escola.secretariaMunicipal'],
    });

    // Busca os apelidos das etapas se houver secretaria
    if (secretariaId && turmas.length > 0) {
      const etapaIds = [...new Set(turmas.map(turma => turma.etapa?.id).filter(Boolean))];
      
      if (etapaIds.length > 0) {
        const apelidosQuery = await this.turmaRepository
          .createQueryBuilder()
          .select('sme.etapa_id', 'etapaId')
          .addSelect('sme.apelido', 'apelido')
          .from('secretaria_municipal_etapa', 'sme')
          .where('sme.secretaria_municipal_id = :secretariaId', { secretariaId })
          .andWhere('sme.etapa_id IN (:...etapaIds)', { etapaIds })
          .getRawMany();

        const apelidosMap = new Map();
        apelidosQuery.forEach(row => {
          apelidosMap.set(row.etapaId, row.apelido);
        });

        // Adiciona o apelido nas etapas
        turmas.forEach(turma => {
          if (turma.etapa) {
            (turma.etapa as any).apelido = apelidosMap.get(turma.etapa.id) || null;
          }
        });
      }
    }

    return turmas;
  }

  async findAnosLetivosTurmasBySecretariaMunicipal(
    acessoControl: AcessoControl,
    secretariaMunicipalId,
  ): Promise<string[]> {
    const qbAcesso = this.turmaRepository.createQueryBuilder('turma');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'turma:read',
      qbAcesso,
    );

    const anosLetivos = await this.turmaRepository
      .createQueryBuilder('turma')
      .select('turma.anoLetivo AS turma_ano_letivo')
      .innerJoin('turma.escola', 'escola')
      .innerJoin('escola.secretariaMunicipal', 'secretariaMunicipal')
      .where('turma.situacao = :situacao', { situacao: true })
      .andWhere('secretariaMunicipal.id = :secretariaMunicipalId', {
        secretariaMunicipalId,
      })
      .groupBy('turma.anoLetivo')
      .orderBy('turma.anoLetivo', 'DESC')
      .getRawMany();

    return anosLetivos.map((turma) => turma.turma_ano_letivo);
  }

  async create(
    acessoControl: AcessoControl,
    data: CreateTurmaDto,
  ): Promise<TurmaEntity> {
    await acessoControl.ensureCanPerform('turma:create', data);

    const entity = this.turmaRepository.create({
      ...data,
      id: uuidv4(),
    });

    const turma = this.turmaRepository.save(entity);

    if (entity.escola?.id) {
      await this.escolaService.updateSituacaoFuncionamento(entity.escola.id);
    }

    return turma;
  }

  async update(
    acessoControl: AcessoControl,
    id: string,
    data: UpdateTurmaDto,
  ): Promise<TurmaEntity> {
    await acessoControl.ensureCanReachTarget(
      'turma:update',
      this.turmaRepository.createQueryBuilder('turma'),
      id,
      data,
    );

    const entity = await this.turmaRepository.preload({
      id,
      ...data,
    });

    if (!entity) {
      throw new NotFoundException(`Entity não encontrada`);
    }

    return this.turmaRepository.save(entity);
  }

  async remove(acessoControl: AcessoControl, id: string) {
    const turma = await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'turma:delete',
      this.turmaRepository.createQueryBuilder('turma'),
      id,
    );

    {
      const { registroVagaRepository } = this.databaseContextService;

      const qb = registroVagaRepository.createQueryBuilder('registroVaga');

      qb.leftJoin('registroVaga.vagasRel', 'vaga');
      qb.where('vaga.id IS NULL');

      qb.innerJoin('registroVaga.turma', 'turma');
      qb.andWhere('turma.id = :idTurma', {
        idTurma: turma.id,
      });

      qb.select(['registroVaga.id']);

      const registroVagasOrfaos = await qb.getMany();

      await registroVagaRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(map(registroVagasOrfaos, 'id'))
        .execute();
    }

    return this.turmaRepository.remove(turma);
  }
}
