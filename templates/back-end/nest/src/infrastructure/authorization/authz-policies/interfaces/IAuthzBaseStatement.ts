import { ClassConstructor } from 'class-transformer';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { AcessoControl } from '../../../acesso-control';
import { ICurrentFuncionario } from '../../../authentication';
import { DatabaseContextService } from '../../../database-context/database-context.service';
import {
  IAuthzPolicyStatementCheck,
  IAuthzPolicyStatementFilter,
} from './IAuthzStatements';

export type IAuthzCheckCanPerformFn = <
  Statement extends IAuthzPolicyStatementCheck,
  Action extends Statement['action'],
  Dto = any,
>(
  action: Action,
  dto?: Dto,
) => Promise<boolean>;

export type IAuthzEnsureCanPerformFn = <
  Statement extends IAuthzPolicyStatementCheck,
  Action extends Statement['action'],
  Dto = any,
>(
  action: Action,
  dto?: Dto,
) => Promise<void>;

export type IAuthzPolicyStatementContext<Dto = unknown> = {
  acessoControl: AcessoControl;

  dto: Dto | null;
  databaseContextService: DatabaseContextService;

  populateOnlyRelatedWithProfile?: boolean;

  currentFuncionario: ICurrentFuncionario | null;

  //

  checkCanPerform: IAuthzCheckCanPerformFn;
  ensureCanPerform: IAuthzEnsureCanPerformFn;

  checkCanReachTarget<
    Statement extends IAuthzPolicyStatementFilter,
    Action extends Statement['action'],
  >(
    action: Action,
    qb: SelectQueryBuilder<any> | null,
    targetId: any,
    dto?: any,
  ): Promise<boolean>;
};

export type IAuthzPolicyStatementKindCheckWithResultFn<Dto> =
  | boolean
  | ((
      context: IAuthzPolicyStatementContext<Dto>,
    ) => Promise<boolean> | boolean);

// ==============================================================================

export type IAuthzPolicyStatementKindCheck<
  Action extends string,
  Dto = unknown,
> = {
  kind: 'check';
  action: Action;

  getDtoClass?: () => ClassConstructor<any>;

  withResult: IAuthzPolicyStatementKindCheckWithResultFn<Dto>;
};

export type IAuthzPolicyStatementKindFilter<
  Action extends string,
  Dto = unknown,
  Entity extends ObjectLiteral = ObjectLiteral,
> = {
  kind: 'filter';
  action: Action;

  getDtoClass?: () => ClassConstructor<any>;

  filter:
    | boolean
    | ((
        context: IAuthzPolicyStatementContext<Dto>,
      ) => Promise<(qb: SelectQueryBuilder<Entity>) => void>);
};

// ==============================================================================
