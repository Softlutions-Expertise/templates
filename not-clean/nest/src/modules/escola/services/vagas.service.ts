import { Inject, Injectable } from '@nestjs/common';
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
import { CreateVagasDto } from '../dto/create-vagas.dto';
import { UpdateVagasDto } from '../dto/update-vagas.dto';
import { RegistroVagasEntity } from '../entities/registro-vagas.entity';
import { VagaEntity } from '../entities/vaga.entity';

@Injectable()
export class VagasService {
  constructor(
    @Inject('VAGAS_REPOSITORY')
    private repository: Repository<VagaEntity>,
    @Inject('REGISTRO_VAGAS_REPOSITORY')
    private registroVagasRepository: Repository<RegistroVagasEntity>,
  ) {}

  async create(
    acessoControl: AcessoControl | null,
    dto: CreateVagasDto,
  ): Promise<VagaEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanPerform('vaga:create', dto);
    }

    const vaga = this.repository.create({
      ...dto,
      id: uuidv4(),
    });

    return this.repository.save(vaga);
  }

  async findAllVagas(): Promise<VagaEntity[]> {
    return this.repository.find({});
  }

  async findAll(
    acessoControl: AcessoControl | null,
    query: PaginateQuery,
  ): Promise<Paginated<VagaEntity>> {
    const qbAcesso = this.repository.createQueryBuilder('vaga');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'vaga:read',
        qbAcesso,
      );
    }

    const paginatedResults = await paginate(query, qbAcesso.clone(), {
      ...paginateConfig,
      relations: [
        'servidor',
        'escola',
        'escola.endereco',
        'escola.secretariaMunicipal',
        'turma',
        'turma.etapa',
        'registroVagas',
      ],
      searchableColumns: [
        'anoLetivo',
        'escola.razaoSocial',
        'escola.nomeFantasia',
        'turma.turno',
        'turma.nome',
      ],
      filterableColumns: {
        ativa: [FilterOperator.EQ],
        anoLetivo: [FilterOperator.EQ],
        'escola.id': [FilterOperator.EQ],
        'escola.secretariaMunicipal.id': [FilterOperator.IN, FilterOperator.EQ],
        'turma.id': [FilterOperator.EQ],
        'turma.turno': [FilterOperator.EQ],
        'turma.anoLetivo': [
          FilterOperator.EQ,
          FilterOperator.GT,
          FilterOperator.GTE,
          FilterOperator.LT,
          FilterOperator.LTE,
        ],
        'turma.situacao': [FilterOperator.EQ],
        'turma.etapa.id': [FilterOperator.EQ],
        'turma.etapa.nome': [FilterOperator.EQ],
        'createdAt': [FilterOperator.BTW, FilterOperator.GT, FilterOperator.LT, FilterOperator.GTE, FilterOperator.LTE],
      },
      // Removido para select funcionar #TODO ajustar posteriormente
      // select: [
      //   'id',
      //   'anoLetivo',
      //   'ativa',
      //   'createdAt',
      //   'updatedAt',
      //   'escola.razaoSocial',
      //   'escola.nomeFantasia',
      //   'turma.nome',
      //   'turma.etapa.nome',
      //   'turma.turno',
      // ],
    });

    // Busca os apelidos das etapas se houver vagas
    if (paginatedResults.data.length > 0) {
      await this.addApelidosToVagas(paginatedResults.data);
    }

    return paginatedResults;
  }

  async findVagasByTurmaId(turmaId: string) {
    const vagas = await this.repository.find({
      where: { turma: { id: turmaId }, ativa: true },
      relations: [
        'turma',
        'turma.etapa',
        'escola',
        'escola.endereco',
        'escola.secretariaMunicipal',
      ],
    });

    // Adiciona os apelidos das etapas
    await this.addApelidosToVagas(vagas);

    return vagas;
  }

  async findVagasByCidade(citiId, etapaId?, secretariaId?) {
    const where: any = {
      escola: {
        endereco: { cidade: { id: citiId } },
        secretariaMunicipal: { id: secretariaId },
      },
      ativa: true,
    };

    if (etapaId) {
      where.turma = { etapa: { id: etapaId } };
    }

    const vagas = await this.repository.find({
      where,
      relations: [
        'turma',
        'turma.etapa',
        'escola',
        'escola.endereco',
        'escola.secretariaMunicipal',
      ],
    });

    // Adiciona os apelidos das etapas se houver secretaria
    if (secretariaId && vagas.length > 0) {
      await this.addApelidosToVagasBySecretaria(vagas, secretariaId);
    }

    return vagas;
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<VagaEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'vaga:read',
        this.repository.createQueryBuilder('vaga'),
        id,
      );
    }

    const vaga = await this.repository.findOne({
      where: { id },
      loadEagerRelations: true,
      relations: {
        servidor: {
          pessoa: true,
        },
        turma: {
          etapa: true,
        },
        escola: {
          secretariaMunicipal: true,
        },
      },
    });

    // Adiciona o apelido da etapa
    if (vaga && vaga.turma?.etapa && vaga.escola?.secretariaMunicipal) {
      await this.addApelidoToVaga(vaga, vaga.escola.secretariaMunicipal.id);
    }

    return vaga;
  }

  async update(
    acessoControl: AcessoControl | null,
    id: string,
    dto: UpdateVagasDto,
  ): Promise<VagaEntity> {
    const vaga = await this.findOne(acessoControl, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'vaga:update',
        this.repository.createQueryBuilder('vaga'),
        id,
        dto,
      );
    }

    return await this.repository.save({
      ...vaga,
      ...dto,
    });
  }

  async delete(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<VagaEntity> {
    const entity = await this.findOne(acessoControl, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'vaga:delete',
        this.repository.createQueryBuilder('vaga'),
        id,
      );
    }

    // Remove a vaga
    await this.repository.remove(entity);

    // Verifica se ainda existem vagas associadas ao registroVagas
    const vagasAssociadas = await this.repository.find({
      where: { registroVagas: { id: entity.registroVagas.id } },
    });

    // Se não houver mais vagas associadas, remove o registroVagas
    if (vagasAssociadas.length === 0) {
      await this.registroVagasRepository.remove(entity.registroVagas);
    }

    return entity;
  }

  private async addApelidosToVagas(vagas: VagaEntity[]) {
    // Agrupa vagas por secretaria municipal para buscar os apelidos
    const vagasPorSecretaria = new Map<string, VagaEntity[]>();
    
    vagas.forEach(vaga => {
      const secretariaId = vaga.escola?.secretariaMunicipal?.id;
      if (secretariaId) {
        if (!vagasPorSecretaria.has(secretariaId)) {
          vagasPorSecretaria.set(secretariaId, []);
        }
        vagasPorSecretaria.get(secretariaId)!.push(vaga);
      }
    });

    // Busca os apelidos para cada secretaria
    for (const [secretariaId, vagasSecretaria] of vagasPorSecretaria) {
      await this.addApelidosToVagasBySecretaria(vagasSecretaria, secretariaId);
    }
  }

  private async addApelidosToVagasBySecretaria(vagas: VagaEntity[], secretariaId: string) {
    // Coleta todas as etapas únicas
    const etapaIds = [...new Set(vagas.map(vaga => vaga.turma?.etapa?.id).filter(Boolean))];
    
    if (etapaIds.length === 0) {
      return;
    }

    // Busca os apelidos das etapas
    const apelidosQuery = await this.repository
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

    // Adiciona os apelidos nas etapas
    vagas.forEach(vaga => {
      if (vaga.turma?.etapa) {
        (vaga.turma.etapa as any).apelido = apelidosMap.get(vaga.turma.etapa.id) || null;
      }
    });
  }

  private async addApelidoToVaga(vaga: VagaEntity, secretariaId: string) {
    if (!vaga.turma?.etapa) {
      return;
    }

    // Busca o apelido da etapa
    const apelidoQuery = await this.repository
      .createQueryBuilder()
      .select('sme.apelido', 'apelido')
      .from('secretaria_municipal_etapa', 'sme')
      .where('sme.secretaria_municipal_id = :secretariaId', { secretariaId })
      .andWhere('sme.etapa_id = :etapaId', { etapaId: vaga.turma.etapa.id })
      .getRawOne();

    if (apelidoQuery) {
      (vaga.turma.etapa as any).apelido = apelidoQuery.apelido;
    }
  }
}
