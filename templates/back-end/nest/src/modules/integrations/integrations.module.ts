import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { IntegrationAccessTokenModule } from './integration-access-token/integration-access-token.module';

@Module({
  imports: [DatabaseModule, IntegrationAccessTokenModule],
  controllers: [],
  exports: [],
  providers: [],
})
export class IntegrationsModule {}
