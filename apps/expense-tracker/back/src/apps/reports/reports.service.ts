import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Client as MinioClient } from 'minio';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import puppeteer from 'puppeteer';

import { Expense } from '@/apps/expenses/entities/expense.entity';
import { generateReport, ReportData, ReportColumn, ReportSummary } from './report-template';

// ----------------------------------------------------------------------

export interface GenerateReportDto {
  userId: string;
  startDate?: string;
  endDate?: string;
  outputType: 'html' | 'pdf' | 'url';
}

// ----------------------------------------------------------------------

@Injectable()
export class ReportsService {
  private minioClient: MinioClient;
  private bucketName: string;

  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectQueue('reports')
    private reportQueue: Queue,
    private configService: ConfigService,
  ) {
    this.minioClient = new MinioClient({
      endPoint: this.configService.get('MINIO_HOST', 'localhost'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000')),
      useSSL: false,
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME', 'reports');
  }

  // Async - com fila
  async generateReportAsync(dto: GenerateReportDto) {
    const job = await this.reportQueue.add('generate-expense-report', dto, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    return job;
  }

  async getJobStatus(jobId: string) {
    const job = await this.reportQueue.getJob(jobId);
    if (!job) return null;

    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress(),
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }

  // Sync - direto
  async generateReportSync(userId: string, startDate?: string, endDate?: string) {
    const html = await this.buildReportHtml(userId, startDate, endDate);
    return html;
  }

  // Sync - PDF para download direto
  async generateReportPdf(userId: string, startDate?: string, endDate?: string): Promise<Buffer> {
    const html = await this.buildReportHtml(userId, startDate, endDate);
    return this.generatePdf(html);
  }

  // Process job (chamado pelo processor)
  async processReportJob(dto: GenerateReportDto) {
    const html = await this.buildReportHtml(dto.userId, dto.startDate, dto.endDate);

    if (dto.outputType === 'pdf' || dto.outputType === 'url') {
      // Generate PDF
      const pdfBuffer = await this.generatePdf(html);
      
      // Upload para MinIO
      const filename = `expense-report-${dto.userId}-${Date.now()}-${randomUUID()}.pdf`;

      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
      }

      await this.minioClient.putObject(
        this.bucketName,
        filename,
        pdfBuffer,
        pdfBuffer.length,
        { 'Content-Type': 'application/pdf' },
      );

      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        filename,
        24 * 60 * 60, // 24 horas
      );

      return { url, filename };
    }

    return { html };
  }

  private async generatePdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=TranslateUI',
        '--disable-extensions',
        '--disable-default-apps',
        '--no-first-run',
        '--single-process',
      ],
    });

    try {
      const page = await browser.newPage();
      
      // Configurar viewport
      await page.setViewport({ width: 1200, height: 800 });
      
      // Carregar conteúdo HTML
      await page.setContent(html, { 
        waitUntil: ['domcontentloaded', 'networkidle2'],
        timeout: 30000,
      });

      // Aguardar renderização do CSS
      await new Promise(r => setTimeout(r, 500));

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
        preferCSSPageSize: true,
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private async buildReportHtml(userId: string, startDate?: string, endDate?: string): Promise<string> {
    // Buscar dados
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const expenses = await this.expenseRepository.find({
      where: { userId, date: Between(start, end) },
      relations: ['category'],
      order: { date: 'DESC' },
    });

    // Calcular totais
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const byCategory = expenses.reduce((acc, expense) => {
      const name = expense.category?.name || 'Sem categoria';
      if (!acc[name]) acc[name] = { amount: 0, count: 0 };
      acc[name].amount += Number(expense.amount);
      acc[name].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    // Montar colunas
    const columns: ReportColumn[] = [
      { header: 'Data', key: 'date', align: 'left' },
      { header: 'Descrição', key: 'description', align: 'left' },
      { header: 'Categoria', key: 'category', align: 'left' },
      { header: 'Valor', key: 'amount', align: 'right', formatter: (v) => this.formatCurrency(v) },
    ];

    // Montar linhas
    const rows = expenses.map(e => ({
      date: format(new Date(e.date), 'dd/MM/yyyy'),
      description: e.description,
      category: e.category?.name || 'Sem categoria',
      amount: Number(e.amount),
    }));

    // Resumo
    const summary: ReportSummary[] = [
      { label: 'Total', value: this.formatCurrency(total), highlight: true },
      { label: 'Despesas', value: String(expenses.length) },
      { label: 'Média', value: this.formatCurrency(expenses.length ? total / expenses.length : 0) },
    ];

    // Gerar relatório
    const reportData: ReportData = {
      title: 'Relatório de Despesas',
      period: `${format(start, 'dd/MM/yyyy', { locale: ptBR })} a ${format(end, 'dd/MM/yyyy', { locale: ptBR })}`,
      columns,
      rows,
      summary,
    };

    return generateReport(reportData);
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
