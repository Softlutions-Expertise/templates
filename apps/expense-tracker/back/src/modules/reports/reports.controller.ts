import { Controller, Get, Post, Query, UseGuards, Request, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '@/infrastructure/authentication/jwt-auth.guard';
import { TipoAcao } from '@/modules/auditoria/entities/auditoria.entity';

// ----------------------------------------------------------------------

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Post('expenses')
  @ApiOperation({ summary: 'Generate expense report (async)' })
  async generateExpenseReport(
    @Body() body: { startDate?: string; endDate?: string },
    @Request() req,
  ) {
    const job = await this.reportsService.generateReportAsync({
      userId: req.user.userId,
      startDate: body.startDate,
      endDate: body.endDate,
      outputType: 'url',
    });

    return {
      jobId: job.id,
      status: 'queued',
      message: 'Relatório em fila de processamento',
    };
  }

  @Get('expenses/status/:jobId')
  @ApiOperation({ summary: 'Check report generation status' })
  async getReportStatus(@Request() req, @Query('jobId') jobId: string) {
    return this.reportsService.getJobStatus(jobId);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Generate expense report (sync)' })
  async getExpenseReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    return this.reportsService.generateReportSync(
      req.user.userId,
      startDate,
      endDate,
    );
  }

  @Get('expenses/pdf')
  @ApiOperation({ summary: 'Download expense report as PDF' })
  async downloadExpenseReportPdf(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.reportsService.generateReportPdf(
      req.user.userId,
      startDate,
      endDate,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="relatorio-despesas.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get('auditoria')
  @ApiOperation({ summary: 'Generate auditoria report (HTML)' })
  async generateAuditoriaReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('acao') acao?: TipoAcao,
    @Query('entidade') entidade?: string,
  ) {
    const html = await this.reportsService.generateAuditoriaReport(
      startDate,
      endDate,
      acao,
      entidade,
    );
    return html;
  }

  @Get('auditoria/pdf')
  @ApiOperation({ summary: 'Download auditoria report as PDF' })
  async downloadAuditoriaReportPdf(
    @Res() res: Response,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('acao') acao?: TipoAcao,
    @Query('entidade') entidade?: string,
  ) {
    const html = await this.reportsService.generateAuditoriaReport(
      startDate,
      endDate,
      acao,
      entidade,
    );

    const pdfBuffer = await this.reportsService.generatePdfFromHtml(html);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="relatorio-auditoria.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
