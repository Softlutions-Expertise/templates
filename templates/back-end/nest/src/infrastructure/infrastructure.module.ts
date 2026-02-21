import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AcessoControlModule } from './acesso-control/acesso-control.module';
import { ArquivoModule } from './arquivo/arquivo.module';
import { AuthenticationModule, JwtAuthGuard } from './authentication';
import { AuthorizationModule } from './authorization';
import { DatabaseContextModule } from './database-context/database-context-module.module';

@Module({
  imports: [
    ArquivoModule,
    DatabaseContextModule,
    AuthenticationModule,
    AuthorizationModule,
    AcessoControlModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [],
})
export class InfrastructureModule {}
