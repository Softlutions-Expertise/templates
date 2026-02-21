import { CurrentFuncionario } from '../../authentication/decorators/current-funcionario';
import { ResolveAcessoControlByCurrentFuncionarioPipe } from '../pipes/ResolveAcessoControlByCurrentFuncionarioPipe';

export const ResolveAcessoControl = (options?: any) =>
  CurrentFuncionario(options, ResolveAcessoControlByCurrentFuncionarioPipe);
