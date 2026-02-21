import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

import { ReportsService, GenerateReportDto } from './reports.service';

// ----------------------------------------------------------------------

@Processor('reports')
export class ReportProcessor {
  private readonly logger = new Logger(ReportProcessor.name);

  constructor(private readonly reportsService: ReportsService) {}

  @Process('generate-expense-report')
  async handleGenerateReport(job: Job<GenerateReportDto>) {
    this.logger.debug(`Processing report job ${job.id}`);
    
    try {
      const result = await this.reportsService.processReportJob(job.data);
      this.logger.debug(`Report job ${job.id} completed`);
      return result;
    } catch (error) {
      this.logger.error(`Report job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}
