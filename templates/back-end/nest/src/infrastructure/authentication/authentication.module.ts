import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../database/database.module';
import { IntegrationAccessTokenModule } from '../../modules/integrations/integration-access-token/integration-access-token.module';
import { pessoaProvider } from '../../modules/providers/pessoa.provider';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { IdpConnectGovBrService } from './idp-connect-govbr/idp-connect-govbr.service';
import { IdpConnectTceService } from './idp-connect-tce/idp-connect-tce.service';
import { JwksRsaClientContainerModule } from './jwks-rsa-client';
import { SessionSerializer } from './serializers';
import { AccessTokenStrategy } from './strategies';
import { AuthStrategies } from './strategies/auth-strategies';

@Module({
  controllers: [AuthenticationController],

  imports: [
    //
    IntegrationAccessTokenModule,
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: AuthStrategies.ACCESS_TOKEN,
    }),
    JwksRsaClientContainerModule,
  ],

  providers: [
    // ...
    AuthenticationService,
    AccessTokenStrategy,
    SessionSerializer,
    IdpConnectTceService,
    IdpConnectGovBrService,
    ...pessoaProvider,
  ],

  exports: [
    // ...
    SessionSerializer,
  ],
})
export class AuthenticationModule {}
