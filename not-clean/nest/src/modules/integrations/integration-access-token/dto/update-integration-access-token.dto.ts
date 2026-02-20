import { PartialType } from '@nestjs/swagger';
import { CreateIntegrationAccessTokenDto } from './create-integration-access-token.dto';

export class UpdateIntegrationAccessTokenDto extends PartialType(
  CreateIntegrationAccessTokenDto,
) {}
