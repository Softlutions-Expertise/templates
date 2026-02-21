import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { escolaProvider } from '../providers/escola.provider';
import { reserva_vagaProvider } from '../providers/reserva-vaga.provider';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationService, ...reserva_vagaProvider, ...escolaProvider],
})
export class NotificationModule {}
