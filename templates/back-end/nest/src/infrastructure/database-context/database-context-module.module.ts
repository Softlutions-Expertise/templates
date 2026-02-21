import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DatabaseContextService } from './database-context.service';

@Global()
@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [DatabaseContextService],
  exports: [DatabaseContextService],
})
export class DatabaseContextModule {}
