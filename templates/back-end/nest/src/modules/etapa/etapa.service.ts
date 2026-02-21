import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { paginateConfig } from '../../config/paginate.config';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { TurmaService } from '../escola/services/turma.service';
import { VagasService } from '../escola/services/vagas.service';
import { SecretariaMunicipalEtapaService } from '../secretaria-municipal-etapa/secretaria-municipal-etapa.service';
import { SecretariaMunicipalEntity } from '../secretaria-municipal/entities/secretaria-municipal.entity';
import { EtapaEntity } from './etapa.entity';
import { DatabaseContextService } from '../../infrastructure/database-context/database-context.service';

@Injectable()
export class EtapaService {
  constructor(
    @Inject('ETAPA_REPOSITORY')
    private readonly repository: Repository<EtapaEntity>,
    @Inject('SECRETARIA_MUNICIPAL_REPOSITORY')
    private secretariaMunicipalRepository: Repository<SecretariaMunicipalEntity>,
    @Inject(forwardRef(() => SecretariaMunicipalEtapaService))
    private readonly secretariaMunicipalEtapaService: SecretariaMunicipalEtapaService,
    private databaseContextService: DatabaseContextService,
    private readonly vagasService: VagasService,
    private readonly turmaService: TurmaService,
  ) {}

  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
  ): Promise<Paginated<EtapaEntity>> {
    const qbAcesso = this.repository.createQueryBuilder('etapa');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'etapa:read',
      qbAcesso,
    );

    // Adiciona JOIN com secretariaMunicipalEtapas para incluir o apelido
    qbAcesso.leftJoin('etapa.secretariaMunicipalEtapas', 'secretariaMunicipalEtapas');
    qbAcesso.leftJoin('secretariaMunicipalEtapas.secretariaMunicipal', 'secretariaMunicipal');

    const results = paginate(query, qbAcesso, {
      ...paginateConfig,
      defaultSortBy: [['id', 'ASC']],
      relations: [
        'secretariaMunicipalEtapas',
        'secretariaMunicipalEtapas.secretariaMunicipal',
      ],
      filterableColumns: {
        'secretariaMunicipalEtapas.secretariaMunicipal.id': [FilterOperator.EQ],
        'secretariaMunicipalEtapas.ativa': [FilterOperator.EQ],
        'secretariaMunicipalEtapas.apelido': [FilterOperator.EQ], // Permite filtrar pelo apelido
      },
      searchableColumns: [
        'nome',
        'secretariaMunicipalEtapas.apelido', // Permite buscar pelo apelido
      ],
    });

    const resolvedResults = await results;
    
    // Mapeia os resultados para incluir o apelido na etapa baseado na secretaria filtrada
    resolvedResults.data = resolvedResults.data.map(etapa => {
      // Se houver filtro por secretaria, usa o apelido dessa secretaria específica
      const secretariaId = query?.filter?.['secretariaMunicipalEtapas.secretariaMunicipal.id'];
      
      if (secretariaId && etapa.secretariaMunicipalEtapas) {
        const secretariaMunicipalEtapa = etapa.secretariaMunicipalEtapas.find(
          sme => sme.secretariaMunicipal.id === secretariaId
        );
        
        if (secretariaMunicipalEtapa) {
          (etapa as any).apelido = secretariaMunicipalEtapa.apelido || null;
        }
      }
      
      // Remove a relação para não expor dados desnecessários
      if (etapa.secretariaMunicipalEtapas) {
        delete etapa.secretariaMunicipalEtapas;
      }
      
      return etapa;
    });

    return resolvedResults;
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: number,
  ): Promise<EtapaEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'etapa:read',
        this.repository.createQueryBuilder('etapa'),
        id,
      );
    }

    const etapa = await this.repository.findOne({
      where: { id },
      relations: ['secretariaMunicipalEtapas', 'secretariaMunicipalEtapas.secretariaMunicipal'],
    });

    if (!etapa) {
      throw new NotFoundException(`Etapa não encontrada`);
    }

    // Para findOne, você pode adicionar o apelido de todas as secretarias ou usar uma lógica específica
    // Aqui estou removendo a relação para manter consistência com findAll
    if (etapa.secretariaMunicipalEtapas) {
      delete etapa.secretariaMunicipalEtapas;
    }

    return etapa;
  }

  async findEtapaBySecretariaMunicipalIDAndDataNascimento(
    acessoControl: AcessoControl | null,
    secretariaMunicipalId: string,
    dataNascimento: string,
    anoLetivo: string,
    _this?: boolean,
  ): Promise<EtapaEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'secretaria:read',
        this.secretariaMunicipalRepository.createQueryBuilder('secretaria'),
        secretariaMunicipalId,
      );
    }
    const birthdate = new Date(dataNascimento);
    const currentYear = parseInt(anoLetivo, 10);

    const secretariaMunicipalEtapas =
      await this.secretariaMunicipalEtapaService.findBySecretariaMunicipalIdAndAtiva(
        secretariaMunicipalId,
      );

    const matchingSecretariaMunicipalEtapas = await Promise.all(
      secretariaMunicipalEtapas.map(async (secretariaMunicipalEtapa) => {
        const [month, day] =
          secretariaMunicipalEtapa.secretariaMunicipal.dataLimite
            .split('-')
            .map(Number);
        const currentDate = new Date(currentYear, month - 1, day);
        const ageInYears = await this.calculateAgeInYears(
          birthdate,
          currentDate,
        );

        const matches =
          (secretariaMunicipalEtapa.idadeInicial === 0 &&
            ageInYears <= secretariaMunicipalEtapa.idadeFinal) ||
          (ageInYears >= secretariaMunicipalEtapa.idadeInicial &&
            ageInYears <= secretariaMunicipalEtapa.idadeFinal);

        return { matches, secretariaMunicipalEtapa };
      }),
    );

    const filteredSecretariaMunicipalEtapas = matchingSecretariaMunicipalEtapas
      .filter((result) => result.matches)
      .map((result) => result.secretariaMunicipalEtapa);

    if (filteredSecretariaMunicipalEtapas.length === 0) {
      const [year, month, day] = dataNascimento.split('-');
      const dataNascimentoFormatada = `${day}/${month}/${year}`;
      if (_this) {
        return null;
      }
      throw new NotFoundException(
        `Nenhuma Etapa encontrada que se enquadre para a SecretariaMunicipal ${secretariaMunicipalEtapas[0].secretariaMunicipal.nomeFantasia} e Data de Nascimento ${dataNascimentoFormatada}`,
      );
    }

    return filteredSecretariaMunicipalEtapas[0].etapa;
  }

  async _findVagasByEtapa(
    cidadeId: number,
    secretariaMunicipalId?: string,
    dataNascimento?: string,
  ): Promise<{ vagas: VagaAgregada[]; etapas: EtapaEntity[] }> {
    try {
      const vagasfilter = await this.vagasService.findVagasByCidade(cidadeId);

      const uniqueSecretarias = secretariaMunicipalId
        ? [secretariaMunicipalId]
        : [
            ...new Set(
              vagasfilter.map((vaga) => vaga.escola.secretariaMunicipal.id),
            ),
          ];

      const matchingEtapas: Map<number, EtapaEntity> = new Map();

      const vagas = (
        await Promise.all(
          uniqueSecretarias.map(async (secretariaId: string) => {
            if (dataNascimento) {
              const etapa =
                await this.findEtapaBySecretariaMunicipalIDAndDataNascimento(
                  null,
                  secretariaId,
                  dataNascimento,
                  new Date().getFullYear().toString(),
                  true,
                );
              if (etapa) {
                matchingEtapas.set(etapa.id, etapa); // Use Map to ensure unique etapas by ID
                return await this.vagasService.findVagasByCidade(
                  cidadeId,
                  etapa.id,
                  secretariaId,
                );
              }
            }
            return [];
          }),
        )
      ).flat();

      const aggregatedVagas = new Map<string, VagaAgregada>();
      const uniqueVagas = new Set<string>();
      const etapasComVagas = new Set<number>(); // Track etapas with vagas

      vagas.forEach((vaga) => {
        const {
          escola: {
            id: escolaId,
            nomeFantasia: escolaNome,
            endereco,
            secretariaMunicipal,
          },
          turma,
          registroVagas,
        } = vaga;

        const escolaEndereco = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade.nome}`;
        const uniqueKey = `${escolaId}-${turma.etapa.nome}-${registroVagas.id}`;

        if (uniqueVagas.has(uniqueKey)) return;
        uniqueVagas.add(uniqueKey);

        const aggregationKey = `${escolaId}-${turma.etapa.nome}`;
        const quantidadeVagas = Number(registroVagas?.quantidadeVagas) || 0;

        const currentAggregation = aggregatedVagas.get(aggregationKey) || {
          escolaNome,
          escolaEndereco,
          secretariaNome: secretariaMunicipal.nomeFantasia,
          etapaNome: turma.etapa.nome,
          quantidadeVagas: 0,
        };

        aggregatedVagas.set(aggregationKey, {
          ...currentAggregation,
          quantidadeVagas: currentAggregation.quantidadeVagas + quantidadeVagas,
        });

        // Add etapa to etapasComVagas
        etapasComVagas.add(turma.etapa.id);
      });

      const etapasFiltradas = Array.from(matchingEtapas.values()).filter(
        (etapa) => etapasComVagas.has(etapa.id),
      );

      return {
        vagas: Array.from(aggregatedVagas.values()),
        etapas: etapasFiltradas,
      };
    } catch (error) {
      console.error(error);
      console.error(error.stack);
    }
  }

  async findVagasByEtapa(
    cidadeId: number,
    secretariaMunicipalId?: string,
    dataNascimento?: string,
    anoLetivo?: string,
  ): Promise<{
    secretarias: Array<{ 
      nome: string; 
      turmas: TurmaInfo[]; 
      etapas: EtapaEntity[]; // Nova array de etapas por secretaria
    }>;
    etapas: EtapaEntity[];
  }> {
    try {
      let turmas = await this.turmaService.findTurmasByCidade(cidadeId);
  
      const uniqueSecretarias = secretariaMunicipalId
        ? [secretariaMunicipalId]
        : [...new Set(turmas.map((turma) => turma.escola.secretariaMunicipal.id))];
  
      const matchingEtapas: Map<number, EtapaEntity> = new Map();
      const secretariasNomes = new Map<string, string>();
      const etapasPorSecretaria = new Map<string, Set<number>>(); // Para rastrear etapas por secretaria
  
      turmas.forEach((turma) => {
        secretariasNomes.set(
          turma.escola.secretariaMunicipal.id,
          turma.escola.secretariaMunicipal.nomeFantasia,
        );
      });
  
      const filteredTurmas = await Promise.all(
        uniqueSecretarias.map(async (secretariaId) => {
          if (!etapasPorSecretaria.has(secretariaId)) {
            etapasPorSecretaria.set(secretariaId, new Set());
          }
  
          if (dataNascimento) {
            const etapa = await this.findEtapaBySecretariaMunicipalIDAndDataNascimento(
              null,
              secretariaId,
              dataNascimento,
              anoLetivo,
              true,
            );
            if (etapa) {
              matchingEtapas.set(etapa.id, etapa);
              etapasPorSecretaria.get(secretariaId)!.add(etapa.id);
              return turmas.filter(
                (turma) =>
                  turma.escola.secretariaMunicipal.id === secretariaId &&
                  turma.etapa.id === etapa.id && turma.anoLetivo === anoLetivo,
              );
            }
            return [];
          }
          
          // Quando não há dataNascimento, coleta todas as etapas da secretaria
          const turmasSecretaria = turmas.filter(
            (turma) => turma.escola.secretariaMunicipal.id === secretariaId,
          );
          
          turmasSecretaria.forEach((turma) => {
            matchingEtapas.set(turma.etapa.id, turma.etapa);
            etapasPorSecretaria.get(secretariaId)!.add(turma.etapa.id);
          });
          
          return turmasSecretaria;
        }),
      );

      // Busca os apelidos das etapas para cada secretaria
      await this.addApelidosToEtapas(Array.from(matchingEtapas.values()), uniqueSecretarias);

      const turmasInfo = await Promise.all(
        filteredTurmas.flat().map(async (turma) => {
          const quantidadeVagas = await this.databaseContextService.vagaRepository
            .createQueryBuilder("vaga")
            .innerJoin("vaga.turma", "turma")
            .where("turma.id = :idTurma", { idTurma: turma.id })
            .andWhere("vaga.ativa = :ativa", { ativa: true })
            .getCount();

          // Busca o apelido da etapa para essa secretaria específica
          const etapaComApelido = Array.from(matchingEtapas.values()).find(e => e.id === turma.etapa.id);
          const apelido = etapaComApelido ? (etapaComApelido as any).apelidos?.[turma.escola.secretariaMunicipal.id] || null : null;

          return {
            turmaId: turma.id,
            turmaNome: turma.nome,
            turno: turma.turno,
            etapaNome: turma.etapa.nome,
            apelido: apelido,
            escolaNome: turma.escola.nomeFantasia,
            escolaEndereco: `${turma.escola.endereco.logradouro}, ${turma.escola.endereco.numero}, ${turma.escola.endereco.bairro}, ${turma.escola.endereco.cidade.nome}`,
            secretariaNome: turma.escola.secretariaMunicipal.nomeFantasia,
            secretariaId: turma.escola.secretariaMunicipal.id, 
            quantidadeVagas,
          };
        }),
      );

      const secretariasMap = new Map<string, { 
        nome: string; 
        turmas: TurmaInfo[]; 
        etapas: EtapaEntity[];
        secretariaId: string;
      }>();

      // Initialize all secretarias with empty turmas and etapas arrays
      uniqueSecretarias.forEach((secretariaId) => {
        const nome = secretariasNomes.get(secretariaId);
        secretariasMap.set(nome, { 
          nome, 
          turmas: [], 
          etapas: [],
          secretariaId 
        });
      });
  
      // Add turmas to respective secretarias
      turmasInfo.forEach((turma) => {
        const { secretariaNome, secretariaId, ...turmaInfo } = turma;
        const secretaria = secretariasMap.get(secretariaNome);
        if (secretaria) {
          secretaria.turmas.push(turmaInfo);
        }
      });
  
      // Add etapas to respective secretarias
      secretariasMap.forEach((secretaria, nomeSecretaria) => {
        const etapasIdsSecretaria = etapasPorSecretaria.get(secretaria.secretariaId);
        if (etapasIdsSecretaria) {
          secretaria.etapas = Array.from(matchingEtapas.values())
            .filter(etapa => etapasIdsSecretaria.has(etapa.id))
            .map(etapa => {
              // Cria uma cópia da etapa com o apelido específico da secretaria
              const etapaCopy = { ...etapa };
              (etapaCopy as any).apelido = (etapa as any).apelidos?.[secretaria.secretariaId] || null;
              delete (etapaCopy as any).apelidos;
              return etapaCopy;
            });
        }
      });
  
      const etapasComApelidos = Array.from(matchingEtapas.values()).map(etapa => {
        const etapaCopy = { ...etapa };
        
        if (secretariaMunicipalId) {
          // Se há filtro por secretaria, inclui apenas o apelido dessa secretaria
          (etapaCopy as any).apelido = (etapa as any).apelidos?.[secretariaMunicipalId] || null;
        } else {
          // Se não há filtro, remove os apelidos da array global
          // (pois agora cada secretaria tem suas próprias etapas com apelidos)
          (etapaCopy as any).apelido = null;
        }
        
        delete (etapaCopy as any).apelidos; // Remove objeto temporário
        return etapaCopy;
      });
  
      // Removes secretariaId from final result
      const secretariasResult = Array.from(secretariasMap.values()).map(secretaria => {
        const { secretariaId, ...rest } = secretaria;
        return rest;
      });
  
      return {
        secretarias: secretariasResult,
        etapas: etapasComApelidos,
      };
  
    } catch (error) {
      console.error(error);
      console.error(error.stack);
      
      // Em caso de erro, retorna estrutura vazia mas consistente
      return {
        secretarias: [],
        etapas: [],
      };
    }
  }

  private async calculateAgeInYears(
    birthdate: Date,
    referenceDate: Date,
  ): Promise<number> {
    const birthYear = birthdate.getFullYear();
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();

    const refYear = referenceDate.getFullYear();
    const refMonth = referenceDate.getMonth();
    const refDay = referenceDate.getDate();

    let yearDifference = refYear - birthYear;
    let monthDifference = refMonth - birthMonth;
    let dayDifference = refDay - birthDay;

    if (monthDifference < 0) {
      yearDifference -= 1;
      monthDifference += 12;
    }

    if (dayDifference < 0) {
      monthDifference -= 1;
    }

    const formattedMonths =
      monthDifference < 10 ? `0${monthDifference}` : `${monthDifference}`;

    const ageInYearsAndMonths = parseFloat(
      `${yearDifference}.${formattedMonths}`,
    );

    return ageInYearsAndMonths;
  }

  // Adicione este método helper para buscar os apelidos
  private async addApelidosToEtapas(etapas: EtapaEntity[], secretariaIds: string[]) {
    if (etapas.length === 0 || secretariaIds.length === 0) {
      return;
    }

    const etapaIds = etapas.map(etapa => etapa.id);

    // Busca todos os apelidos de uma vez
    const apelidosQuery = await this.repository
      .createQueryBuilder()
      .select('sme.etapa_id', 'etapaId')
      .addSelect('sme.secretaria_municipal_id', 'secretariaId')
      .addSelect('sme.apelido', 'apelido')
      .from('secretaria_municipal_etapa', 'sme')
      .where('sme.secretaria_municipal_id IN (:...secretariaIds)', { secretariaIds })
      .andWhere('sme.etapa_id IN (:...etapaIds)', { etapaIds })
      .getRawMany();

    // Organiza os apelidos por etapa e secretaria
    const apelidosMap = new Map<number, Map<string, string>>();
    apelidosQuery.forEach(row => {
      if (!apelidosMap.has(row.etapaId)) {
        apelidosMap.set(row.etapaId, new Map());
      }
      apelidosMap.get(row.etapaId)!.set(row.secretariaId, row.apelido);
    });

    // Adiciona os apelidos nas etapas
    etapas.forEach(etapa => {
      const apelidosPorSecretaria = apelidosMap.get(etapa.id);
      if (apelidosPorSecretaria) {
        (etapa as any).apelidos = Object.fromEntries(apelidosPorSecretaria.entries());
      }
    });
  }
}

interface VagaAgregada {
  escolaNome: string;
  escolaEndereco: string;
  secretariaNome: string;
  etapaNome: string;
  quantidadeVagas: number;
}

interface TurmaInfo {
  turmaId: string;
  turmaNome: string;
  turno: string;
  etapaNome: string;
  apelido: string | null; 
  escolaNome: string;
  escolaEndereco: string;
  quantidadeVagas: number;
}
