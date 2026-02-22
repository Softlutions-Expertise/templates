import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { IntegrationAccessTokenController } from './integration-access-token.controller';
import { IntegrationAccessTokenService } from './integration-access-token.service';

@Module({
  imports: [DatabaseModule],
  controllers: [IntegrationAccessTokenController],
  exports: [IntegrationAccessTokenService],
  providers: [IntegrationAccessTokenService],
})
export class IntegrationAccessTokenModule {}
