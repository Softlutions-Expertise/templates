import { ForbiddenException } from '@nestjs/common';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { ICurrentColaborador } from '../../authentication';
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
    readonly currentColaborador: ICurrentColaborador,
    private readonly authzPolicy: IAuthzPolicy,
    private readonly databaseContextService: DatabaseContextService,
  ) {}

  /**
   * @deprecated Use currentColaborador instead
   */
  get currentFuncionario() {
    return this.currentColaborador;
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
      colaborador: this.currentColaborador,
      authzPolicy: await this.authzPolicy.publicWhoAmI(
        await this.createContext(null),
      ),
      permissions: {
        static: await this.getStaticPermissions(),
        dynamic: await this.getDynamicPermissions(),
      },
    };
  }

  private async createContext(
    dto = null,
    populateOnlyRelatedWithProfile = false,
  ) {
    const context: IAuthzPolicyStatementContext = {
      acessoControl: this,
      dto,
      populateOnlyRelatedWithProfile,
      currentColaborador: this.currentColaborador,
      currentFuncionario: this.currentColaborador,
      databaseContextService: this.databaseContextService,
      checkCanPerform: this.checkCanPerform.bind(this),
      ensureCanPerform: this.ensureCanPerform.bind(this),
      checkCanReachTarget: this.checkCanReachTarget.bind(this),
    };

    return context;
  }

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
      case 'colaborador:read':
      case 'colaborador:delete':
      case 'colaborador:update': {
        return this.databaseContextService.colaboradorRepository.createQueryBuilder(
          'colaborador',
        );
      }

      default: {
        throw new Error(
          `AcessoControl#getQueryBuilderForAction: não implementado para a action '${action}'.`,
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
