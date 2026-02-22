import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { pessoaProvider } from '../providers/pessoa.provider';
import { ReportController } from './report.controller';
import { ReportService } from './services/report.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportController],
  providers: [
    ReportService,
    ...pessoaProvider,
  ],
})
export class ReportModule {}
