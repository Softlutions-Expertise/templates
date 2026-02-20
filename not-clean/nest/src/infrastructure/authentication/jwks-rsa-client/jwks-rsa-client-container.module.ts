import { Module } from '@nestjs/common';

import { JwksRsaClientContainer } from './jwks-rsa-client-container';

@Module({
  imports: [],
  providers: [JwksRsaClientContainer],
  exports: [JwksRsaClientContainer],
})
export class JwksRsaClientContainerModule {}
