import { Controller, Get, Post, Param, Query, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  private validateAuth(header: string): string {
    // Simples validação - em produção use JWT
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }
    // Extrai userId do token (mock)
    return header.replace('Bearer ', '');
  }

  @Post()
  create(
    @Body() dto: CreateReportDto,
    @Headers('authorization') auth: string,
  ) {
    const userId = this.validateAuth(auth);
    return this.reportsService.create({ ...dto, userId });
  }

  @Get()
  findAll(@Headers('authorization') auth: string) {
    const userId = this.validateAuth(auth);
    return this.reportsService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    const userId = this.validateAuth(auth);
    return this.reportsService.findOne(id, userId);
  }

  @Get(':id/download')
  download(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    const userId = this.validateAuth(auth);
    return this.reportsService.getDownloadUrl(id, userId);
  }
}
