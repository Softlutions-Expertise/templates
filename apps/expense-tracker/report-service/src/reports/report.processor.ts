import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ReportsService } from './reports.service';
import { ReportStatus } from './entities/report.entity';
import { MinioService } from '../storage/minio.service';
import { ReportPdfGenerator } from './report-pdf.generator';

interface ReportJobData {
  reportId: string;
  userId: string;
  type: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}

@Processor('reports')
export class ReportProcessor {
  private readonly logger = new Logger(ReportProcessor.name);
  private readonly pdfGenerator: ReportPdfGenerator;

  constructor(
    private readonly reportsService: ReportsService,
    private readonly minioService: MinioService,
  ) {
    this.pdfGenerator = new ReportPdfGenerator();
  }

  @Process('generate-report')
  async handleGenerateReport(job: Job<ReportJobData>) {
    const { reportId, userId, type, startDate, endDate, categoryId } = job.data;
    this.logger.log(`Processing report ${reportId}`);

    try {
      await this.reportsService.updateStatus(reportId, ReportStatus.PROCESSING);

      // Busca dados da API principal (expense-tracker-back)
      const expenses = await this.fetchExpenses(userId, startDate, endDate, categoryId);

      // Gera PDF
      const pdfBuffer = await this.pdfGenerator.generate({
        title: this.getReportTitle(type),
        startDate,
        endDate,
        categoryId,
        expenses,
      });

      // Upload para MinIO
      const filename = `report-${reportId}-${Date.now()}.pdf`;
      await this.minioService.uploadPdf(pdfBuffer, filename);

      // Atualiza status
      await this.reportsService.updateStatus(reportId, ReportStatus.COMPLETED, { fileName: filename });

      this.logger.log(`Report ${reportId} completed`);
      return { filename };
    } catch (error) {
      this.logger.error(`Report ${reportId} failed: ${error.message}`);
      await this.reportsService.updateStatus(reportId, ReportStatus.FAILED, { errorMessage: error.message });
      throw error;
    }
  }

  private async fetchExpenses(
    userId: string,
    startDate?: string,
    endDate?: string,
    categoryId?: string,
  ): Promise<any[]> {
    // Chama a API principal para buscar despesas
    const apiUrl = process.env.API_URL || 'http://localhost:3001';
    const url = new URL(`${apiUrl}/api/expenses`);
    
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);
    if (categoryId) url.searchParams.append('categoryId', categoryId);

    // Em produção, use um service account ou internal API key
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${userId}`, // Simplificado - usar JWT real
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch expenses: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  private getReportTitle(type: string): string {
    const titles: Record<string, string> = {
      expense_summary: 'Relatório de Despesas',
      category_breakdown: 'Análise por Categoria',
      monthly_trend: 'Tendência Mensal',
    };
    return titles[type] || 'Relatório';
  }
}
