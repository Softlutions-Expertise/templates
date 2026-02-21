import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import {
  AuthzPolicyAdministrador,
  AuthzPolicyAdministradorSecretariaMunicipio,
  AuthzPolicyAtendenteSecretaria,
  AuthzPolicyDefensoria,
  AuthzPolicyGestorCreche,
  BaseAuthzPolicy,
} from './authz-policies';

@Module({
  imports: [],
  controllers: [],
  providers: [
    //
    BaseAuthzPolicy,
    AuthzPolicyAdministrador,
    AuthzPolicyAdministradorSecretariaMunicipio,
    AuthzPolicyAtendenteSecretaria,
    AuthzPolicyGestorCreche,
    AuthzPolicyDefensoria,
    //
    AuthorizationService,
  ],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
