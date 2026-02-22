import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { pessoaProvider } from '../providers/pessoa.provider';
import { NotificationService } from './notification.service';

@Module({
  imports: [DatabaseModule],
  providers: [NotificationService, ...pessoaProvider],
  exports: [NotificationService],
})
export class NotificationModule {}
