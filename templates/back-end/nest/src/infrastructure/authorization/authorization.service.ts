import { ForbiddenException, Injectable } from '@nestjs/common';
import { NivelAcesso } from '../../modules/pessoa/entities/enums/pessoa.enum';
import { ICurrentColaborador } from '../authentication';
import { BaseAuthzPolicy } from './authz-policies';

@Injectable()
export class AuthorizationService {
  constructor(private baseAuthzPolicy: BaseAuthzPolicy) {}

  async getAuthzPolicy(currentColaborador: ICurrentColaborador) {
    if (currentColaborador) {
      if (currentColaborador.usuario.situacaoCadastral === false) {
        throw new ForbiddenException(
          'Situação cadastral do usuário está desativada.',
        );
      }

      // Aqui você pode adicionar políticas específicas por nível de acesso
      // Por enquanto, usamos a política base para todos
      if (currentColaborador.usuario.nivelAcesso === NivelAcesso.Administrador) {
        // Política de administrador
      }
    }

    return this.baseAuthzPolicy;
  }

  /**
   * @deprecated Use getAuthzPolicy instead
   */
  async getAuthzPolicyByFuncionario(currentFuncionario: ICurrentColaborador) {
    return this.getAuthzPolicy(currentFuncionario);
  }
}
