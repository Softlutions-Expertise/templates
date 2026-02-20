import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { RegistroVagasEntity } from '../escola/entities/registro-vagas.entity';
import { ReservaVagaEntity } from '../reserva-vaga/entities/reserva-vaga.entity';
import { ReservaVagaStatusEnum } from '../reserva-vaga/enums/reserva-vaga-status.enum';

interface NotificationQueryParams {
  unidadeEscolarId?: string;
  secretariaMunicipalId?: string;
  lastDateViewed?: string;
}

interface NotificationResponse {
  registroVagas: any[];
  reservaVagas: any[];
  total: number;
}

@Injectable()
export class NotificationService {
  constructor(
    @Inject('REGISTRO_VAGAS_REPOSITORY')
    private registroVagaRepository: Repository<RegistroVagasEntity>,
    @Inject('RESERVA_VAGA_REPOSITORY')
    private reservaVagaRepository: Repository<ReservaVagaEntity>,
  ) {}

  async getNotifications(
    acessoControl: AcessoControl,
    query: NotificationQueryParams,
  ): Promise<NotificationResponse> {
    const { unidadeEscolarId, secretariaMunicipalId, lastDateViewed } = query;

    const nivelAcesso = acessoControl.currentFuncionario.usuario.nivelAcesso;
    const createdAtFuncionario =
      acessoControl.currentFuncionario.pessoa.createdAt;

    const subDays30 = new Date();
    subDays30.setDate(subDays30.getDate() - 30);

    let registroVagas = [];
    let reservaVagas = [];

    if (nivelAcesso !== Roles.GestorDeCreche.toString()) {
      registroVagas = await this.getRegistroVagasNotifications(acessoControl, {
        unidadeEscolarId,
        secretariaMunicipalId,
        lastDateViewed,
        createdAtFuncionario,
        subDays30,
      });
    }

    if (nivelAcesso !== Roles.AtendenteSecretaria.toString()) {
      reservaVagas = await this.getReservaVagasNotifications(acessoControl, {
        unidadeEscolarId,
        secretariaMunicipalId,
        lastDateViewed,
        createdAtFuncionario,
        subDays30,
      });
    }

    const totalItens = registroVagas.length + reservaVagas.length;

    return { registroVagas, reservaVagas, total: totalItens };
  }

  private async getRegistroVagasNotifications(
    acessoControl: AcessoControl,
    params: {
      unidadeEscolarId: string;
      secretariaMunicipalId: string;
      lastDateViewed: string;
      createdAtFuncionario: Date;
      subDays30: Date;
    },
  ): Promise<any[]> {
    const {
      unidadeEscolarId,
      secretariaMunicipalId,
      lastDateViewed,
      createdAtFuncionario,
      subDays30,
    } = params;

    const qbRegistroVaga =
      this.registroVagaRepository.createQueryBuilder('registro_vaga');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'registro_vaga:read',
      qbRegistroVaga,
    );

    qbRegistroVaga
      .leftJoin('registro_vaga.escola', 'escola')
      .leftJoin('escola.secretariaMunicipal', 'secretariaMunicipal')
      .leftJoin('registro_vaga.turma', 'turma')
      .leftJoin('turma.etapa', 'etapa')
      // Adiciona JOIN para buscar o apelido da etapa
      .leftJoin(
        'secretaria_municipal_etapa',
        'sme',
        'sme.secretaria_municipal_id = secretariaMunicipal.id AND sme.etapa_id = etapa.id',
      );

    qbRegistroVaga.andWhere(
      'EXISTS (SELECT 1 FROM vagas v WHERE v.registro_vagas_id = registro_vaga.id AND v.ativa = true)',
    );

    qbRegistroVaga.andWhere('registro_vaga.createdAt > :createdAtFuncionario', {
      createdAtFuncionario,
    });

    qbRegistroVaga.andWhere('registro_vaga.createdAt > :subDays30', {
      subDays30,
    });

    if (lastDateViewed) {
      qbRegistroVaga.andWhere('registro_vaga.createdAt > :lastDateViewed', {
        lastDateViewed,
      });
    }

    if (unidadeEscolarId) {
      qbRegistroVaga.andWhere('escola.id = :unidadeEscolarId', {
        unidadeEscolarId,
      });
    }

    if (secretariaMunicipalId) {
      qbRegistroVaga.andWhere(
        'secretariaMunicipal.id = :secretariaMunicipalId',
        {
          secretariaMunicipalId,
        },
      );
    }

    qbRegistroVaga
      .orderBy('registro_vaga.createdAt', 'DESC')
      .select([
        'registro_vaga.id',
        'registro_vaga.createdAt',
        'registro_vaga.quantidadeVagas',
        'turma.id',
        'turma.nome',
        'turma.turno',
        'etapa.id',
        'etapa.nome',
        'escola.id',
        'escola.nomeFantasia',
      ])
      .addSelect('sme.apelido', 'etapaApelido') // Adiciona o apelido
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(v.id)')
            .from('vagas', 'v')
            .where('v.registro_vagas_id = registro_vaga.id')
            .andWhere('v.ativa = true'),
        'quantidadeVagasLivres',
      );

    const rawResults = await qbRegistroVaga.getRawAndEntities();

    // Mapeia os resultados para incluir o apelido na etapa
    const mappedResults = rawResults.entities.map((entity, index) => {
      const raw = rawResults.raw[index];

      const dynamicEntity: any = entity;

      if (dynamicEntity.turma?.etapa) {
        dynamicEntity.turma.etapa.apelido = raw?.etapaApelido || null;
      }

      dynamicEntity.quantidadeVagasLivres = +(raw.quantidadeVagasLivres ?? 0);

      return dynamicEntity;
    });

    return mappedResults;
  }

  private async getReservaVagasNotifications(
    acessoControl: AcessoControl,
    params: {
      unidadeEscolarId: string;
      secretariaMunicipalId: string;
      lastDateViewed: string;
      createdAtFuncionario: Date;
      subDays30: Date;
    },
  ): Promise<any[]> {
    const {
      unidadeEscolarId,
      secretariaMunicipalId,
      lastDateViewed,
      createdAtFuncionario,
      subDays30,
    } = params;

    const qbReservaVaga =
      this.reservaVagaRepository.createQueryBuilder('reserva_vaga');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'reserva_vaga:read',
      qbReservaVaga,
    );

    qbReservaVaga
      .leftJoin('reserva_vaga.vaga', 'vaga')
      .leftJoin('vaga.escola', 'escola')
      .leftJoin('escola.secretariaMunicipal', 'secretariaMunicipal')
      .leftJoin('vaga.turma', 'turma')
      .leftJoin('turma.etapa', 'etapa')
      // Adiciona JOIN para buscar o apelido da etapa
      .leftJoin(
        'secretaria_municipal_etapa',
        'sme',
        'sme.secretaria_municipal_id = secretariaMunicipal.id AND sme.etapa_id = etapa.id',
      )
      .leftJoin('reserva_vaga.crianca', 'crianca');

    qbReservaVaga.andWhere('reserva_vaga.status = :status', {
      status: ReservaVagaStatusEnum.PENDENTE,
    });

    qbReservaVaga.andWhere('reserva_vaga.createdAt > :createdAtFuncionario', {
      createdAtFuncionario,
    });

    qbReservaVaga.andWhere('reserva_vaga.createdAt > :subDays30', {
      subDays30,
    });

    if (lastDateViewed) {
      qbReservaVaga.andWhere('reserva_vaga.createdAt > :lastDateViewed', {
        lastDateViewed,
      });
    }

    if (unidadeEscolarId) {
      qbReservaVaga.andWhere('escola.id = :unidadeEscolarId', {
        unidadeEscolarId,
      });
    }

    if (secretariaMunicipalId) {
      qbReservaVaga.andWhere(
        'secretariaMunicipal.id = :secretariaMunicipalId',
        {
          secretariaMunicipalId,
        },
      );
    }

    qbReservaVaga
      .orderBy('reserva_vaga.createdAt', 'DESC')
      .select([
        'reserva_vaga.id',
        'reserva_vaga.createdAt',
        'reserva_vaga.status',
        'vaga.id',
        'vaga.anoLetivo',
        'turma.id',
        'turma.nome',
        'turma.turno',
        'etapa.id',
        'etapa.nome',
        'escola.id',
        'escola.nomeFantasia',
        'crianca.id',
        'crianca.nome',
        'crianca.cpf',
      ])
      .addSelect('sme.apelido', 'etapaApelido'); // Adiciona o apelido

    const rawResults = await qbReservaVaga.getRawAndEntities();

    // Mapeia os resultados para incluir o apelido na etapa
    const mappedResults = rawResults.entities.map((entity, index) => {
      const raw = rawResults.raw[index];

      if (entity.vaga?.turma?.etapa) {
        (entity.vaga.turma.etapa as any).apelido = raw?.etapaApelido || null;
      }

      return entity;
    });

    return mappedResults;
  }
}
