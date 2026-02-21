import { IAuthzPolicyStatementContext } from './IAuthzBaseStatement';
import { IAuthzPolicyStatement } from './IAuthzStatements';

export interface IAuthzPolicy {
  readonly name: string;

  publicWhoAmI(
    context: IAuthzPolicyStatementContext,
  ): Promise<{ name: string }>;

  readonly statements: IAuthzPolicyStatement[];
}
