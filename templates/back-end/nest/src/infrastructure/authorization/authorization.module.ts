import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { BaseAuthzPolicy } from './authz-policies';

@Module({
  imports: [],
  controllers: [],
  providers: [
    BaseAuthzPolicy,
    AuthorizationService,
  ],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
