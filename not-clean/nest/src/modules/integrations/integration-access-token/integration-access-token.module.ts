import { Module } from '@nestjs/common';
import { IntegrationAccessTokenController } from './integration-access-token.controller';
import { IntegrationAccessTokenService } from './integration-access-token.service';

@Module({
  imports: [],
  controllers: [IntegrationAccessTokenController],
  exports: [IntegrationAccessTokenService],
  providers: [IntegrationAccessTokenService],
})
export class IntegrationAccessTokenModule {}
