import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  NivelAcesso,
  TipoVinculoInstituicao,
} from '../../modules/pessoa/entities/enums/pessoa.enum';
import { ICurrentFuncionario } from '../authentication';
import {
  AuthzPolicyAdministrador,
  AuthzPolicyAdministradorSecretariaMunicipio,
  AuthzPolicyAtendenteSecretaria,
  AuthzPolicyDefensoria,
  AuthzPolicyGestorCreche,
  BaseAuthzPolicy,
} from './authz-policies';

@Injectable()
export class AuthorizationService {
  constructor(
    private baseAuthzPolicy: BaseAuthzPolicy,
    private authzPolicyAdministrador: AuthzPolicyAdministrador,
    private authzPolicyAdministradorSecretariaMunicipio: AuthzPolicyAdministradorSecretariaMunicipio,
    private authzPolicyAtendenteSecretaria: AuthzPolicyAtendenteSecretaria,
    private authzPolicyGestorCreche: AuthzPolicyGestorCreche,
    private authzPolicyDefensoria: AuthzPolicyDefensoria,
  ) {}

  async getAuthzPolicy(currentFuncionario: ICurrentFuncionario) {
    if (currentFuncionario) {
      if (currentFuncionario.usuario.situacaoCadastral === false) {
        throw new ForbiddenException(
          'Situação cadastral do usuário está desativada.',
        );
      }

      if (
        currentFuncionario.usuario.nivelAcesso === NivelAcesso.Administrador
      ) {
        return this.authzPolicyAdministrador;
      }

      if (
        currentFuncionario.tipoVinculo ===
          TipoVinculoInstituicao.SecretariaMunicipal &&
        currentFuncionario.usuario.nivelAcesso ===
          NivelAcesso.AdministradorMunicipal
      ) {
        return this.authzPolicyAdministradorSecretariaMunicipio;
      }

      if (
        currentFuncionario.tipoVinculo ===
          TipoVinculoInstituicao.SecretariaMunicipal &&
        currentFuncionario.usuario.nivelAcesso ===
          NivelAcesso.AtendenteSecretaria
      ) {
        return this.authzPolicyAtendenteSecretaria;
      }

      if (
        currentFuncionario.tipoVinculo ===
          TipoVinculoInstituicao.UnidadeEscolar &&
        currentFuncionario.usuario.nivelAcesso === NivelAcesso.GestorCreche
      ) {
        return this.authzPolicyGestorCreche;
      }

      if (currentFuncionario.usuario.nivelAcesso === NivelAcesso.Defensoria) {
        return this.authzPolicyDefensoria;
      }
    }

    return this.baseAuthzPolicy;
  }
}
