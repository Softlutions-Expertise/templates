import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DebugController } from './debug.controller';
import { DebugService } from './debug.service';
import { AllExceptionsFilter } from './exception-filters/AllExceptionsFilter';
import { DebugStoreProvider } from './store/debug-store.provider';

@Global()
@Module({
  controllers: [DebugController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    DebugService,
    DebugStoreProvider,
  ],
  exports: [DebugService, DebugStoreProvider],
})
export class DebugModule {}
