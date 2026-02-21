import { Inject, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { type Address } from 'nodemailer/lib/mailer';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import eventBus from '../../../helpers/eventEmitter.helper';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import {
  NivelAcesso,
  TipoVinculoInstituicao,
} from '../../pessoa/entities/enums/pessoa.enum';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { CreateRegistroVagasDto } from '../dto/create-registro-vagas.dto';
import { RegistroVagasEntity } from '../entities/registro-vagas.entity';
import { VagasService } from './vagas.service';

@Injectable()
export class RegistroVagasService {
  constructor(
    @Inject('REGISTRO_VAGAS_REPOSITORY')
    private repository: Repository<RegistroVagasEntity>,
    private repositoryVagas: VagasService,
    private databaseContext: DatabaseContextService,
  ) {
    eventBus.on('regitroVagas:criarRegistroVagas', async (dto) => {
      await this.create(null, dto);
    });
  }

  async findAll(
    acessoControl: AcessoControl | null,
    query: PaginateQuery,
  ): Promise<Paginated<RegistroVagasEntity>> {
    const qb = this.repository.createQueryBuilder('registro_vaga');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'registro_vaga:read',
        qb,
      );
    }

    // Adiciona JOIN para buscar o apelido da etapa
    qb.leftJoin('registro_vaga.turma', 'turma')
      .leftJoin('turma.etapa', 'etapa')
      .leftJoin('registro_vaga.escola', 'escola')
      .leftJoin('escola.secretariaMunicipal', 'secretariaMunicipal')
      .leftJoin(
        'secretaria_municipal_etapa',
        'sme',
        'sme.secretaria_municipal_id = secretariaMunicipal.id AND sme.etapa_id = etapa.id'
      )
      .addSelect('sme.apelido', 'etapaApelido');

    const paginatedResults = await paginate(query, qb, {
      ...paginateConfig,
      defaultSortBy: [
        //
        ['id', 'DESC'],
      ],
      sortableColumns: ['id', 'createdAt'],
      relations: {
        turma: {
          etapa: true,
        },
        escola: {
          secretariaMunicipal: true,
        },
        servidor: true,
      },
      searchableColumns: [
        'anoLetivo',
        'escola.nomeRegional',
        'turma.turno' /*'status'*/,
      ],
      filterableColumns: {
        createdAt: [
          //
          FilterOperator.EQ,
          FilterOperator.GT,
          FilterOperator.GTE,
          FilterOperator.LT,
          FilterOperator.LTE,
        ],
        'escola.secretariaMunicipal.id': [FilterOperator.EQ],
        'sme.apelido': [FilterOperator.EQ], // Permite filtrar pelo apelido
      },
    });

    // Busca os apelidos para mapear corretamente
    const idsRegistros = paginatedResults.data.map(item => item.id);
    
    const apelidosMap = new Map();
    if (idsRegistros.length > 0) {
      const apelidosQuery = await this.repository
        .createQueryBuilder('registro_vaga')
        .leftJoin('registro_vaga.turma', 'turma')
        .leftJoin('turma.etapa', 'etapa')
        .leftJoin('registro_vaga.escola', 'escola')
        .leftJoin('escola.secretariaMunicipal', 'secretariaMunicipal')
        .leftJoin(
          'secretaria_municipal_etapa',
          'sme',
          'sme.secretaria_municipal_id = secretariaMunicipal.id AND sme.etapa_id = etapa.id'
        )
        .select('registro_vaga.id', 'registroId')
        .addSelect('sme.apelido', 'etapaApelido')
        .where('registro_vaga.id IN (:...ids)', { ids: idsRegistros })
        .getRawMany();

      apelidosQuery.forEach(row => {
        apelidosMap.set(row.registroId, row.etapaApelido);
      });
    }

    // Mapeia os resultados para incluir o apelido na etapa
    paginatedResults.data = paginatedResults.data.map(registro => {
      if (registro.turma?.etapa) {
        (registro.turma.etapa as any).apelido = apelidosMap.get(registro.id) || null;
      }
      return registro;
    });

    return paginatedResults;
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<CreateRegistroVagasDto> {
    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'registro_vaga:read',
        this.repository.createQueryBuilder('registro_vaga'),
        id,
      );
    }

    const registroVagas = await this.repository.findOne({
      where: { id },
      relations: [
        'escola', 
        'escola.secretariaMunicipal',
        'turma', 
        'turma.etapa',
        'servidor', 
        'servidor.pessoa'
      ],
    });

    // Busca o apelido da etapa
    if (registroVagas?.turma?.etapa && registroVagas?.escola?.secretariaMunicipal) {
      const apelidoQuery = await this.repository
        .createQueryBuilder()
        .select('sme.apelido', 'apelido')
        .from('secretaria_municipal_etapa', 'sme')
        .where('sme.secretaria_municipal_id = :secretariaId', { 
          secretariaId: registroVagas.escola.secretariaMunicipal.id 
        })
        .andWhere('sme.etapa_id = :etapaId', { 
          etapaId: registroVagas.turma.etapa.id 
        })
        .getRawOne();

      if (apelidoQuery) {
        (registroVagas.turma.etapa as any).apelido = apelidoQuery.apelido;
      }
    }

    const query = 'SELECT * FROM vagas WHERE registro_vagas_id = $1';
    const vagas = await this.repository.query(query, [id]);

    return { ...registroVagas, vagas: vagas };
  }

  private async generateNotificationEmail(id: string) {
    const entity = await this.repository.findOne({
      where: { id },
      relations: [
        'escola',
        'turma',
        'turma.etapa',
        'escola.secretariaMunicipal',
        'servidor.pessoa',
        'servidor.usuario',
      ],
    });

    // Busca o apelido da etapa para incluir na notificação
    let etapaApelido = null;
    if (entity?.turma?.etapa && entity?.escola?.secretariaMunicipal) {
      const apelidoQuery = await this.repository
        .createQueryBuilder()
        .select('sme.apelido', 'apelido')
        .from('secretaria_municipal_etapa', 'sme')
        .where('sme.secretaria_municipal_id = :secretariaId', { 
          secretariaId: entity.escola.secretariaMunicipal.id 
        })
        .andWhere('sme.etapa_id = :etapaId', { 
          etapaId: entity.turma.etapa.id 
        })
        .getRawOne();

      etapaApelido = apelidoQuery?.apelido || null;
    }

    const funcionarios = await this.databaseContext.funcionarioRepository
      .createQueryBuilder('funcionario')
      .leftJoin('funcionario.usuario', 'usuario')
      .leftJoin('funcionario.pessoa', 'pessoa')
      .leftJoin('pessoa.contato', 'contato')
      .innerJoin('funcionario.secretarias', 'secretaria')
      .where('secretaria.id = :secretariaMunicipalId', {
        secretariaMunicipalId: entity.escola.secretariaMunicipal.id,
      })
      .andWhere('funcionario.tipoVinculo = :tipoVinculo', {
        tipoVinculo: TipoVinculoInstituicao.SecretariaMunicipal,
      })
      .andWhere('usuario.nivelAcesso = :nivelAcesso', {
        nivelAcesso: NivelAcesso.AtendenteSecretaria,
      })
      .andWhere('usuario.situacaoCadastral = :situacaoCadastral', {
        situacaoCadastral: true,
      })
      .addSelect(['funcionario.id', 'pessoa.nome', 'contato'])
      .getMany();

    const fTimePortuguese = (timeStandard: string) => {
      const timeSplit = timeStandard.split(':');
      const [hour, minute] = timeSplit.map((i) => +i);
      if (minute === 0) {
        return `${hour}h`;
      }
      return `${hour}h${minute}`;
    };

    function getMainAddress(funcionario: FuncionarioEntity): string {
      return Array.from(funcionario.pessoa.contato.emails).sort((a, b) => {
        if (a.principal === b.principal) {
          return 0;
        }
        if (b.principal) {
          return 1;
        }
        return -1;
      })?.[0].email;
    }

    const notification = {
      id: entity.id,
      //
      dataHoraVaga: entity.dataHoraVaga,
      anoLetivo: entity.anoLetivo,
      escola: entity.escola,
      quantidadeVagas: entity.quantidadeVagas,
      //
      servidor: {
        id: entity.servidor.id,
        nome: entity.servidor.pessoa.nome,
      },
      turma: {
        nome: entity.turma.nome,
        etapa: {
          nome: entity.turma.etapa.nome,
          apelido: etapaApelido, // Inclui o apelido na notificação
        },
        turno: entity.turma.turno,
        periodoInicial: format(new Date(entity.turma.periodoInicial), 'dd/MM/yyyy'),
        periodoFinal: format(new Date(entity.turma.periodoFinal), 'dd/MM/yyyy'),
        horarioInicial: fTimePortuguese(entity.turma.horarioInicial),
        horarioFinal: fTimePortuguese(entity.turma.horarioFinal),
      },
      //
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      //
      interessados: [
        ...funcionarios
          .map(
            (funcionario): Address => ({
              name: funcionario.pessoa.nome,
              address: getMainAddress(funcionario),
            }),
          )
          .filter((i) => Boolean(i.address)),
      ],
    };

    return notification;
  }
  

  async create(
    acessoControl: AcessoControl | null,
    dto: CreateRegistroVagasDto,
  ): Promise<RegistroVagasEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanPerform('registro_vaga:create', dto);
    }

    // Primeiro, salva o registro de vagas
    const registroVagas = this.repository.create({
      ...dto,
      id: uuidv4(),
    });

    await this.repository.save(registroVagas);

    // Em seguida, cria e salva as vagas individuais
    for (let i = 0; i < dto.quantidadeVagas; i++) {
      await this.repositoryVagas.create(null, {
        dataHoraVaga: dto.dataHoraVaga,
        servidor: dto.servidor,
        anoLetivo: dto.anoLetivo,
        escola: dto.escola,
        turma: dto.turma,
        ativa: true,
        registroVagas: registroVagas, // Associa a vaga ao registro de vagas
      });
    }

    const notification = await this.generateNotificationEmail(registroVagas.id);

    eventBus.emit('mailer:enviarNotificacaoRegistroVagas', notification);
    eventBus.emit('whatsapp:enviarNotificacaoRegistroVagas', notification);

    return registroVagas;
  }
}
