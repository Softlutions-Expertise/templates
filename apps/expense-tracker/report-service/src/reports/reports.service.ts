import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Report, ReportStatus } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { MinioService } from '../storage/minio.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectQueue('reports')
    private readonly reportsQueue: Queue,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreateReportDto): Promise<Report> {
    const report = this.reportRepository.create({
      ...dto,
      type: dto.type as any,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      status: ReportStatus.PENDING,
    });

    const saved = await this.reportRepository.save(report);

    await this.reportsQueue.add('generate-report', {
      reportId: saved.id,
      userId: dto.userId,
      type: dto.type,
      startDate: dto.startDate,
      endDate: dto.endDate,
      categoryId: dto.categoryId,
    });

    this.logger.log(`Report queued: ${saved.id}`);
    return saved;
  }

  async findAll(userId: string): Promise<Report[]> {
    return this.reportRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id, userId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async getDownloadUrl(id: string, userId: string): Promise<{ url: string; filename: string }> {
    const report = await this.findOne(id, userId);

    if (report.status !== ReportStatus.COMPLETED) {
      throw new NotFoundException('Report not ready');
    }

    const url = await this.minioService.getPresignedUrl(report.fileName, 3600);
    return { url, filename: report.fileName };
  }

  async updateStatus(id: string, status: ReportStatus, data?: { fileName?: string; errorMessage?: string }): Promise<void> {
    const update: any = { status };
    
    if (data?.fileName) {
      update.fileName = data.fileName;
      update.fileUrl = data.fileName;
    }
    
    if (data?.errorMessage) {
      update.errorMessage = data.errorMessage;
    }
    
    if (status === ReportStatus.COMPLETED) {
      update.completedAt = new Date();
    }

    await this.reportRepository.update(id, update);
  }
}
