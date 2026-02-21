import { Module } from '@nestjs/common';
import { IntegrationAccessTokenModule } from './integration-access-token/integration-access-token.module';

@Module({
  imports: [IntegrationAccessTokenModule],
  controllers: [],
  exports: [],
  providers: [],
})
export class IntegrationsModule {}
