import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtAuthGuard } from './authentication/guards/jwt-auth.guard';
import { AuthorizationModule } from './authorization/authorization.module';
import { ArquivoModule } from './arquivo/arquivo.module';

@Module({
  imports: [
    AuthenticationModule,
    AuthorizationModule,
    ArquivoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthenticationModule, AuthorizationModule, ArquivoModule],
})
export class InfrastructureModule {}
