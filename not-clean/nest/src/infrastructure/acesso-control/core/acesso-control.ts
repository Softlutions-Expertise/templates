import { ForbiddenException, NotImplementedException } from '@nestjs/common';
import {
  FindOperator,
  In,
  IsNull,
  Not,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { IMaybeString } from '../../../helpers/typings';
import { ICurrentFuncionario } from '../../authentication';
import {
  IAuthzPolicy,
  IAuthzPolicyStatement,
  IAuthzPolicyStatementCheck,
  IAuthzPolicyStatementContext,
  IAuthzPolicyStatementFilter,
} from '../../authorization';
import { DatabaseContextService } from '../../database-context/database-context.service';

const statementDynamic = (statement: IAuthzPolicyStatement) =>
  (statement.kind === 'filter' && typeof statement.filter !== 'boolean') ||
  (statement.kind === 'check' && typeof statement.withResult !== 'boolean');

const statementStatic = (statement: IAuthzPolicyStatement) =>
  !statementDynamic(statement);

export class AcessoControl {
  constructor(
    readonly currentFuncionario: ICurrentFuncionario,
    private readonly authzPolicy: IAuthzPolicy,
    private readonly databaseContextService: DatabaseContextService,
  ) {}

  static async resolveProfile(
    acessoControl: AcessoControl,
    filterEecretariaId: IMaybeString,
    filterEscolaId: IMaybeString,
    filterLocalAtendimentoId?: IMaybeString,
  ) {
    //

    const { currentFuncionario } = acessoControl;

    //

    let targetLocaisAtendimentosIds: string[] | null = [filterLocalAtendimentoId];
    let targetEscolasIds: string[] | null = [filterEscolaId];
    let targetSecretariasMunicipaisId: string[] | null = [filterEecretariaId];

    if (currentFuncionario.unidadesEscolares?.length > 0) {
      const usuarioEscolasIds = currentFuncionario.unidadesEscolares.map(
        (escola) => escola.id,
      );

      targetEscolasIds = usuarioEscolasIds.filter((id) => {
        if (filterEscolaId) {
          return id === filterEscolaId;
        }

        return true;
      });
    }



    targetEscolasIds = targetEscolasIds.filter((id) => {
      return typeof id === 'string';
    });

    if (targetEscolasIds.length === 0) {
      targetEscolasIds = null;
    }

    if (currentFuncionario.secretarias?.length > 0) {
      const usuarioSecretariasIds = currentFuncionario.secretarias.map(
        (secretaria) => secretaria.id,
      );

      targetSecretariasMunicipaisId = usuarioSecretariasIds.filter((id) => {
        if (filterEecretariaId) {
          return id === filterEecretariaId;
        }

        return true;
      });
    }

    targetSecretariasMunicipaisId = targetSecretariasMunicipaisId.filter(
      (id) => {
        return typeof id === 'string';
      },
    );

    if (targetSecretariasMunicipaisId.length === 0) {
      targetSecretariasMunicipaisId = null;
    }


    targetLocaisAtendimentosIds = targetLocaisAtendimentosIds.filter((id) => {
      return typeof id === 'string';
    });

    if (targetLocaisAtendimentosIds.length === 0) {
      targetLocaisAtendimentosIds = null;
    }


    return {
      targetEscolasIds,
      targetSecretariasMunicipaisId,
      targetLocaisAtendimentosIds,
    };
  }

  getStatementForAction(action: IAuthzPolicyStatement['action']) {
    return (
      this.authzPolicy.statements.find(
        (statement) => statement.action === action,
      ) ?? null
    );
  }

  async getStaticPermissions(): Promise<{ action: string; can: boolean }[]> {
    return this.authzPolicy.statements
      .filter(statementStatic)
      .map((statement: IAuthzPolicyStatement) => ({
        action: statement.action,
        can: <boolean>(
          (statement.kind === 'check' ? statement.withResult : statement.filter)
        ),
      }));
  }

  async getDynamicPermissions(): Promise<
    { action: string; kind: 'check' | 'filter' }[]
  > {
    return this.authzPolicy.statements
      .filter(statementDynamic)
      .map((statement: IAuthzPolicyStatement) => ({
        kind: statement.kind,
        action: statement.action,
      }));
  }

  async getWhoAmI() {
    return {
      funcionario: this.currentFuncionario,

      authzPolicy: await this.authzPolicy.publicWhoAmI(
        await this.createContext(null),
      ),

      permissions: {
        static: await this.getStaticPermissions(),
        dynamic: await this.getDynamicPermissions(),
      },
    };
  }

  //

  private async createContext(
    dto = null,
    populateOnlyRelatedWithProfile = false,
  ) {
    const context: IAuthzPolicyStatementContext = {
      acessoControl: this,
      dto,
      populateOnlyRelatedWithProfile,
      //
      currentFuncionario: this.currentFuncionario,
      databaseContextService: this.databaseContextService,
      //
      checkCanPerform: this.checkCanPerform.bind(this),
      ensureCanPerform: this.ensureCanPerform.bind(this),
      checkCanReachTarget: this.checkCanReachTarget.bind(this),
    };

    return context;
  }

  //

  private async getStatementCheckResult(
    statementForAction: IAuthzPolicyStatement,
    dto?: any,
  ) {
    if (statementForAction.kind === 'check') {
      const context = await this.createContext(dto);

      const result =
        typeof statementForAction.withResult === 'boolean'
          ? statementForAction.withResult
          : await statementForAction.withResult(<any>context);

      return result;
    }

    throw new TypeError(
      "You can't call AcessoControl#getCheckResult for statements that is not kind=check",
    );
  }

  async checkCanPerform<
    Statement extends IAuthzPolicyStatementCheck,
    Action extends Statement['action'],
    Dto = any,
  >(action: Action, dto?: Dto): Promise<boolean> {
    const statementForAction = this.getStatementForAction(action);

    if (statementForAction && statementForAction.kind === 'check') {
      return this.getStatementCheckResult(statementForAction, dto);
    }

    return false;
  }

  async ensureCanPerform<
    Statement extends IAuthzPolicyStatementCheck,
    Action extends Statement['action'],
    Dto = any,
  >(action: Action, dto?: Dto): Promise<void> {
    const can = await this.checkCanPerform(action, dto);

    if (!can) {
      throw new ForbiddenException(
        `Permissões insuficientes para realizar esta ação: '${action}'.`,
      );
    }
  }

  //

  async createQueryBuilderConditionFilterFactoryByStatement<
    Statement extends IAuthzPolicyStatement | null,
  >(
    statementForAction: Statement,
    dto?: any,
    populateOnlyRelatedWithProfile = false,
  ): Promise<(qb: SelectQueryBuilder<any>) => void> {
    if (statementForAction && statementForAction.kind === 'filter') {
      const filter = statementForAction.filter;

      if (typeof filter === 'boolean') {
        return (qb: SelectQueryBuilder<any>) => {
          qb.where(filter ? 'TRUE' : 'FALSE');
        };
      } else {
        const context = await this.createContext(
          dto,
          populateOnlyRelatedWithProfile,
        );
        const applyConditionToQb = await filter(<any>context);

        return (qb: SelectQueryBuilder<any>) => {
          qb.where(applyConditionToQb);
        };
      }
    }

    return (qb: SelectQueryBuilder<any>) => {
      qb.where('FALSE');
    };
  }

  async createQueryBuilderConditionFilterFactoryByStatementAction<
    Statement extends IAuthzPolicyStatement | null,
    Action extends Statement['action'],
  >(
    action: Action,
    dto?: any,
    populateOnlyRelatedWithProfile = false,
  ): Promise<(qb: SelectQueryBuilder<any>) => void> {
    const statementForAction = this.getStatementForAction(action);
    return this.createQueryBuilderConditionFilterFactoryByStatement(
      statementForAction,
      dto,
      populateOnlyRelatedWithProfile,
    );
  }

  async applyConditionFilterToQueryBuilderByStatement<
    Statement extends IAuthzPolicyStatement | null,
  >(
    statementForAction: Statement,
    qb: SelectQueryBuilder<any>,
    dto?: any,
    populateOnlyRelatedWithProfile = false,
  ) {
    const factory =
      await this.createQueryBuilderConditionFilterFactoryByStatement(
        statementForAction,
        dto,
        populateOnlyRelatedWithProfile,
      );

    qb.andWhere(factory);

    return qb;
  }

  async applyConditionFilterToQueryBuilderByStatementAction<
    Statement extends IAuthzPolicyStatementFilter,
    Action extends Statement['action'],
  >(
    action: Action,
    qb: SelectQueryBuilder<any>,
    dto?: any,
    populateOnlyRelatedWithProfile = false,
  ) {
    const statementForAction = this.getStatementForAction(action);

    await this.applyConditionFilterToQueryBuilderByStatement(
      statementForAction,
      qb,
      dto,
      populateOnlyRelatedWithProfile,
    );

    return qb;
  }

  getQueryBuilderForFilterAction<
    Statement extends IAuthzPolicyStatementFilter,
    Action extends Statement['action'],
  >(action: Action) {
    switch (action) {
      case 'secretaria:read':
      case 'secretaria:update':
      case 'secretaria:delete':
      case 'secretaria:criterios:read':
      case 'secretaria:criterios:change':
      case 'secretaria:gerencia_agendamento:update':
      case 'secretaria:gerencia_agendamento:read': {
        return this.databaseContextService.secretariaMunicipalRepository.createQueryBuilder(
          'secretaria',
        );
      }

      case 'escola:read':
      case 'escola:delete':
      case 'escola:update': {
        return this.databaseContextService.escolaRepository.createQueryBuilder(
          'escola',
        );
      }

      case 'agendamento:read':
      case 'agendamento:delete':
      case 'agendamento:update': {
        return this.databaseContextService.agendamentoRepository.createQueryBuilder(
          'agendamento',
        );
      }

      case 'entrevista:read':
      case 'entrevista:delete':
      case 'entrevista:update': {
        return this.databaseContextService.entrevistaRepository.createQueryBuilder(
          'entrevista',
        );
      }

      case 'registro_contato:read':
      case 'registro_contato:delete':
      case 'registro_contato:update': {
        return this.databaseContextService.registrarContatoRepository.createQueryBuilder(
          'registro_contato ',
        );
      }

      case 'turma:read':
      case 'turma:delete':
      case 'turma:update': {
        return this.databaseContextService.turmaRepository.createQueryBuilder(
          'turma',
        );
      }

      case 'servidor:read':
      case 'servidor:delete':
      case 'servidor:update': {
        return this.databaseContextService.funcionarioRepository.createQueryBuilder(
          'funcionario',
        );
      }

      case 'registro_vaga:read': {
        return this.databaseContextService.registroVagaRepository.createQueryBuilder(
          'registro_vaga',
        );
      }

      case 'vaga:read':
      case 'vaga:delete':
      case 'vaga:update': {
        return this.databaseContextService.vagaRepository.createQueryBuilder(
          'vaga',
        );
      }

      case 'fila:read': {
        return this.databaseContextService.filaRepository.createQueryBuilder(
          'fila',
        );
      }

      case 'criterio:read': {
        return this.databaseContextService.criterioRepository.createQueryBuilder(
          'criterio',
        );
      }

      case 'reserva_vaga:read':
      case 'reserva_vaga:delete':
      case 'reserva_vaga:update':
      case 'reserva_vaga:update:status': {
        return this.databaseContextService.reservaVagaRepository.createQueryBuilder(
          'reserva_vaga',
        );
      }

      default: {
        console.warn(
          `AuthService#getQueryBuilderForAction: não implementado para a action '${action}'.`,
        );

        throw new NotImplementedException(
          `AuthService#getQueryBuilderForAction: não implementado para a action '${action}'.`,
        );
      }
    }
  }

  async checkCanReachTarget<
    Statement extends IAuthzPolicyStatementFilter,
    Action extends Statement['action'],
  >(
    action: Action,
    qb: SelectQueryBuilder<any> | null,
    targetId: any,
    dto?: any,
  ) {
    if (!qb) {
      qb = this.getQueryBuilderForFilterAction(action);
    }

    await this.applyConditionFilterToQueryBuilderByStatementAction(
      action,
      qb,
      dto,
    );

    if (targetId) {
      qb.andWhereInIds([targetId]);
    }

    const exists = await qb.getExists();
    return exists;
  }

  async getReachableTargets<
    Entity extends ObjectLiteral,
    Id extends Entity['id'] = Entity['id'],
    Statement extends IAuthzPolicyStatementFilter = IAuthzPolicyStatementFilter,
    Action extends Statement['action'] = Statement['action'],
  >(
    action: Action,
    qb: SelectQueryBuilder<Entity>,
    populateOnlyRelatedWithProfile = false,
  ): Promise<Id[]> {
    await this.applyConditionFilterToQueryBuilderByStatementAction(
      action,
      qb,
      populateOnlyRelatedWithProfile,
    );
    const rows = await qb.select([`${qb.alias}.id`]).getMany();
    return rows.map((row) => row.id);
  }

  async getReachableTargetsTypeorm<
    Entity extends ObjectLiteral,
    Statement extends IAuthzPolicyStatementFilter = IAuthzPolicyStatementFilter,
    Action extends Statement['action'] = Statement['action'],
  >(
    action: Action,
    qb: SelectQueryBuilder<Entity>,
    populateOnlyRelatedWithProfile = false,
  ): Promise<FindOperator<any> | undefined> {
    await this.applyConditionFilterToQueryBuilderByStatementAction(
      action,
      qb,
      populateOnlyRelatedWithProfile,
    );

    if (qb.expressionMap.wheres.length === 1) {
      const [where] = qb.expressionMap.wheres;

      if (where.type === 'simple') {
        if (where.condition === 'TRUE') {
          return Not(IsNull());
        } else {
          return IsNull();
        }
      }
    }

    const rows = await qb.select([`${qb.alias}.id`]).getMany();
    const ids = rows.map((row) => row.id);
    return In(ids);
  }

  async ensureCanReachTarget<
    Statement extends IAuthzPolicyStatementFilter,
    Action extends Statement['action'],
  >(
    action: Action,
    qb: SelectQueryBuilder<any> | null,
    targetId: any,
    dto?: any,
  ) {
    if (!qb) {
      qb = this.getQueryBuilderForFilterAction(action);
    }

    const can = await this.checkCanReachTarget(action, qb, targetId, dto);

    if (!can) {
      throw new ForbiddenException(
        `Permissões insuficientes para realizar esta ação: '${action}'.`,
      );
    }
  }
}
