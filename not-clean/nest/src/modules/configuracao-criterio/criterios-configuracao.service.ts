import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { uniqBy } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../infrastructure/database-context/database-context.service';
import { SecretariaMunicipalEntity } from '../secretaria-municipal/entities/secretaria-municipal.entity';
import { ConfigurarCriteriosDto } from './dtos/ConfigurarCriteriosDto';
import {
  CriterioConfiguracaoNotaTecnica,
  CriteriosConfiguracaoCriterioEntity,
} from './entities/criterios-configuracao-criterio.entity';
import { CriteriosConfiguracaoEntity } from './entities/criterios-configuracao.entity';

@Injectable()
export class CriteriosConfiguracaoService {
  constructor(private databaseContextService: DatabaseContextService) {}

  //

  get configuracaoRepository() {
    return this.databaseContextService.configuracaoRepository;
  }

  get configuracaoCriterioRepository() {
    return this.databaseContextService.configuracaoCriterioRepository;
  }

  get secretariaMunicipalRepository() {
    return this.databaseContextService.secretariaMunicipalRepository;
  }

  get criteriosRepository() {
    return this.databaseContextService.criteriosRepository;
  }

  //

  async internalFindConfiguracaoCriterioAtualByCriterioId(criterioId: string) {
    const qb = this.configuracaoCriterioRepository.createBaseQb();

    this.configuracaoCriterioRepository.createQueryBuilderForCriterioId(
      criterioId,
      qb,
    );

    qb.innerJoin('configuracao_criterio.criteriosConfiguracao', 'configuracao');

    this.configuracaoRepository.createQueryBuilderFilterActive(qb);

    const configuracaoCriterio = await qb.getOne();

    return configuracaoCriterio;
  }

  async internalFindConfiguracaoAtualBySecretariaMunicipalId(
    secretariaMunicipalId: SecretariaMunicipalEntity['id'],
  ) {
    const qb = this.configuracaoRepository
      .createQueryBuilder('configuracao')
      .innerJoin('configuracao.secretariaMunicipal', 'secretaria')
      .where('secretaria.id = :secretariaMunicipalId', {
        secretariaMunicipalId: secretariaMunicipalId,
      })
      .select('configuracao');

    this.configuracaoRepository.createQueryBuilderFilterActive(
      qb,
      'configuracao',
    );

    const configuracaoAtual = await qb.getOne();

    return configuracaoAtual;
  }

  async internalFindConfiguracaoAtualListBySecretariaMunicipalId(
    secretariaMunicipalId: SecretariaMunicipalEntity['id'],
  ): Promise<Pick<CriteriosConfiguracaoEntity, 'id'>[]> {
    const qb = this.configuracaoRepository
      .createQueryBuilder('configuracao')
      .innerJoin('configuracao.secretariaMunicipal', 'secretaria')
      .where('secretaria.id = :secretariaMunicipalId', {
        secretariaMunicipalId: secretariaMunicipalId,
      })
      .select('configuracao.id');

    this.configuracaoRepository.createQueryBuilderFilterActive(
      qb,
      'configuracao',
    );

    const configuracoes = await qb.getMany();

    return configuracoes;
  }

  async internalFindConfiguracaoAtualOrCreateBySecretariaMunicipalId(
    secretariaMunicipalId: SecretariaMunicipalEntity['id'],
    createIfNotExists = true,
  ) {
    const configuracaoAtual =
      await this.internalFindConfiguracaoAtualBySecretariaMunicipalId(
        secretariaMunicipalId,
      );

    if (configuracaoAtual) {
      return configuracaoAtual;
    } else if (createIfNotExists) {
      const configuracaoNovo = this.configuracaoRepository.create();

      this.configuracaoRepository.merge(configuracaoNovo, {
        id: uuid(),
        secretariaMunicipal: {
          id: secretariaMunicipalId,
        },
        dataVigenciaInicio: new Date(),
        dataVigenciaFim: null,
      });

      await this.configuracaoRepository.save(configuracaoNovo);

      return this.internalFindConfiguracaoAtualBySecretariaMunicipalId(
        secretariaMunicipalId,
      );
    }

    return null;
  }

  async internalFindConfiguracaoCriterioListByCriteriosConfiguracaoId(
    criteriosConfiguracaoId: CriteriosConfiguracaoEntity['id'],
  ) {
    if (criteriosConfiguracaoId) {
      const qb: SelectQueryBuilder<CriteriosConfiguracaoCriterioEntity> =
        this.configuracaoCriterioRepository.createQueryBuilderForCriteriosConfiguracaoId(
          criteriosConfiguracaoId,
        );

      const configuracaoCriterioList = await qb.getMany();

      return configuracaoCriterioList;
    }

    return [];
  }

  async internalFindConfiguracaoCriterioListBySecretariaMunicipalId(
    secretariaMunicipalId: SecretariaMunicipalEntity['id'],
  ) {
    const configuracao =
      await this.internalFindConfiguracaoAtualBySecretariaMunicipalId(
        secretariaMunicipalId,
      );

    if (configuracao) {
      const configuracaoCriterioList =
        await this.internalFindConfiguracaoCriterioListByCriteriosConfiguracaoId(
          configuracao.id,
        );

      return configuracaoCriterioList;
    }

    return [];
  }

  async internalConsultaDefinicoesAtual(
    secretariaMunicipalId: SecretariaMunicipalEntity['id'],
    createIfNotExists = true,
  ) {
    const configuracao =
      await this.internalFindConfiguracaoAtualOrCreateBySecretariaMunicipalId(
        secretariaMunicipalId,
        createIfNotExists,
      );

    const definicoes =
      await this.internalFindConfiguracaoCriterioListByCriteriosConfiguracaoId(
        configuracao.id,
      );

    return {
      configuracao: {
        id: configuracao.id,
        dataVigenciaInicio: configuracao.dataVigenciaInicio,
        dataVigenciaFim: configuracao.dataVigenciaFim,
      },

      definicoes,
    };
  }

  // Rota esta pública no BaseAuthzPolicy
  async consultaDefinicoesAtual(
    acessoControl: AcessoControl | null,
    secretariaMunicipalId: SecretariaMunicipalEntity['id'],
  ) {
    if (acessoControl !== null) {
      await acessoControl.ensureCanReachTarget(
        'secretaria:criterios:read',
        this.secretariaMunicipalRepository.createQueryBuilder('secretaria'),
        secretariaMunicipalId,
      );
    }

    return this.internalConsultaDefinicoesAtual(secretariaMunicipalId, true);
  }

  async configurarCriterios(
    acessoControl: AcessoControl,
    secretariaMunicipalId: SecretariaMunicipalEntity['id'],
    dto: ConfigurarCriteriosDto,
  ) {
    const dtoUniaoNotas = [...dto.definidos, ...dto.nota_c, ...dto.nota_h];

    if (!uniqBy(dtoUniaoNotas, 'id')) {
      throw new UnprocessableEntityException(
        'Um critério não pode estar duplicado na configuração!',
      );
    }

    // Garantir que os critérios (dto.definidos[*].criterio.id, dto.nota_c[*]criterio.id, dto.nota_h[*].criterio.id) pertencam à secretaria (secretariaMunicipalId)

    for (const dtoNota of dtoUniaoNotas) {
      const criterioSecretaria = await this.criteriosRepository
        .createQueryBuilder('criterio')
        .innerJoin('criterio.secretariaMunicipal', 'secretaria')
        .where('criterio.id = :criterioId', {
          criterioId: dtoNota.criterio.id,
        })
        .andWhere('secretaria.id = :secretariaId', {
          secretariaId: secretariaMunicipalId,
        })
        .getExists()
        .catch(() => false);

      if (!criterioSecretaria) {
        throw new UnprocessableEntityException(
          `O critério '${dtoNota.criterio.id}' não pode ser vinculado a secretaria informada (${secretariaMunicipalId}). Certifique-se de que ele exista e esteja vinculado a mesma secretaria que você deseja configurar.`,
        );
      }
    }

    await acessoControl.ensureCanReachTarget(
      'secretaria:criterios:change',
      this.secretariaMunicipalRepository.createQueryBuilder('secretaria'),
      secretariaMunicipalId,
      dto,
    );

    const agora = new Date();

    const configuracaoAtual =
      await this.internalFindConfiguracaoAtualBySecretariaMunicipalId(
        secretariaMunicipalId,
      );

    const configuracaoNovo = this.configuracaoRepository.create();

    this.configuracaoRepository.merge(configuracaoNovo, {
      id: uuid(),
      secretariaMunicipal: {
        id: secretariaMunicipalId,
      },
    });

    await this.configuracaoRepository.save(configuracaoNovo);

    //

    if (configuracaoAtual) {
      const configuracaoCriterioAtualList =
        await this.internalFindConfiguracaoCriterioListByCriteriosConfiguracaoId(
          configuracaoAtual.id,
        );

      for (const configuracaoCriterioAtual of configuracaoCriterioAtualList) {
        if (
          configuracaoCriterioAtual.notaTecnica ===
          CriterioConfiguracaoNotaTecnica.DEFINIDO
        ) {
          const configDefinido =
            dto.definidos?.find(
              (i) => i.criterio.id === configuracaoCriterioAtual.criterio.id,
            ) ?? null;

          const configuracaoCriterioNovo =
            this.configuracaoCriterioRepository.create();

          this.configuracaoCriterioRepository.merge(configuracaoCriterioNovo, {
            id: uuid(),

            notaTecnica: configuracaoCriterioAtual.notaTecnica,
            posicao: configuracaoCriterioAtual.posicao,
            subPosicao: configuracaoCriterioAtual.subPosicao,

            exigirComprovacao:
              configDefinido?.exigirComprovacao ??
              configuracaoCriterioAtual.exigirComprovacao,

            criterio: {
              id: configuracaoCriterioAtual.criterio.id,
            },

            criteriosConfiguracao: {
              id: configuracaoNovo.id,
            },
          });

          await this.configuracaoCriterioRepository.save(
            configuracaoCriterioNovo,
          );
        }
      }
    }

    //

    const customNotasTecnicas = [
      {
        notaTecnica: CriterioConfiguracaoNotaTecnica.TIPO_C,
        posicao: 3,
        items: dto.nota_c,
      },
      {
        notaTecnica: CriterioConfiguracaoNotaTecnica.TIPO_H,
        posicao: 8,
        items: dto.nota_h,
      },
    ] as const;

    for (const { notaTecnica, posicao, items } of customNotasTecnicas) {
      for (const [idx, item] of items.entries()) {
        const index = +idx;

        const configuracaoCriterioNovo =
          this.configuracaoCriterioRepository.create();

        this.configuracaoCriterioRepository.merge(configuracaoCriterioNovo, {
          id: uuid(),

          notaTecnica: notaTecnica,
          posicao: posicao,
          subPosicao: index + 1,
          exigirComprovacao: item.exigirComprovacao,

          criterio: {
            id: item.criterio.id,
          },

          criteriosConfiguracao: {
            id: configuracaoNovo.id,
          },
        });

        await this.configuracaoCriterioRepository.save(
          configuracaoCriterioNovo,
        );
      }
    }

    const configuracoesAnterioresSemDataVigenciaFim =
      await this.internalFindConfiguracaoAtualListBySecretariaMunicipalId(
        secretariaMunicipalId,
      );

    await this.configuracaoRepository
      .createQueryBuilder('configuracao')
      .update()
      .whereInIds(configuracoesAnterioresSemDataVigenciaFim.map((i) => i.id))
      .set({
        dataVigenciaFim: agora,
      })
      .execute();

    configuracaoNovo.dataVigenciaInicio = agora;
    configuracaoNovo.dataVigenciaFim = null;

    await this.configuracaoRepository.save(configuracaoNovo);

    return this.consultaDefinicoesAtual(acessoControl, secretariaMunicipalId);
  }

  async publicCurrentCriterios(secretariaMunicipalId: string) {
    const secretariaMunicipal =
      await this.secretariaMunicipalRepository.findOne({
        where: { id: secretariaMunicipalId },
      });

    if (!secretariaMunicipal) {
      throw new NotFoundException(`Secretaria Municipal não encontrada`);
    }

    const definicoesAtuaisSecretaria =
      await this.internalConsultaDefinicoesAtual(secretariaMunicipalId, true);
    const criterios = [];
    for (const definicao of definicoesAtuaisSecretaria.definicoes) {
      const criterio = {
        posicao: definicao.posicao,
        subPosicao: definicao.subPosicao,
        nome: definicao.criterio.nome,
        exigirComprovacao: definicao.exigirComprovacao,
      };
      criterios.push(criterio);
    }

    const hasPosicao3 = criterios.some((criterio) => criterio.posicao === 3);
    if (!hasPosicao3) {
      criterios.push({
        posicao: 3,
        subPosicao: null,
        nome: `${secretariaMunicipal.nomeFantasia} ainda não possui um critério com a prioridade 3`,
        exigirComprovacao: false,
      });
    }

    const hasPosicao8 = criterios.some((criterio) => criterio.posicao === 8);
    if (!hasPosicao8) {
      criterios.push({
        posicao: 8,
        subPosicao: null,
        nome: `${secretariaMunicipal.nomeFantasia} ainda não possui um critério com a prioridade 8`,
        exigirComprovacao: false,
      });
    }

    criterios.push({
      posicao: criterios.length + 1,
      subPosicao: null,
      nome: 'Data de solicitação do pedido para matrícula e/ou entrada na fila de espera',
      exigirComprovacao: false,
    });

    criterios.sort((a, b) => {
      if (a.posicao === b.posicao) {
        return (a.subPosicao || 0) - (b.subPosicao || 0);
      }
      return a.posicao - b.posicao;
    });

    return criterios;
  }
}
