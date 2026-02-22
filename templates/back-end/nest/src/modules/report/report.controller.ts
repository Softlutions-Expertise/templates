import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import PQueue from 'p-queue';
import { GetDoc } from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { ReportService } from './services/report.service';

@ApiTags('Relatórios')
@Controller('report')
export class ReportController {
  private queue = new PQueue({ concurrency: 2 });

  constructor(private readonly reportService: ReportService) {}

  /**
   * Gera um relatório com base no tipo e parâmetros recebidos.
   * @param reportType - Tipo de relatório a ser gerado.
   * @param query - Parâmetros recebidos na requisição.
   */
  @Get('/generateReport/:reportType')
  @GetDoc(
    'Relatórios',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    [
      {
        name: 'outputJson',
        type: Boolean,
        required: false,
      },
    ],
  )
  @ApiParam({
    name: 'reportType',
    type: String,
    required: true,
    description: 'Tipo de relatório a ser gerado',
  })
  async generateReport(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('reportType') reportType: string,
    @Query() query: any,
  ) {
    if (!reportType) {
      throw new BadRequestException('O parâmetro reportType é obrigatório.');
    }

    return this.queue.add(async () => {
      const payload = await this.reportService.generateReport(
        acessoControl,
        reportType,
        query,
      );

      if (query.outputJson === 'true') return payload;

      const url = `${process.env.REPORT_SERVICE_URL}/generate-pdf/${reportType}/url`;

      try {
        const response = await axios({
          method: 'post',
          url: url,
          headers: {
            'Content-Type': 'application/json',
          },
          data: payload,
        });

        return {
          message: 'Report generated successfully',
          data: response.data,
        };
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          if (status >= 400 && status < 500) {
            throw new BadRequestException(data);
          } else if (status >= 500) {
            throw new InternalServerErrorException(data);
          }
        }

        throw new InternalServerErrorException(error.message);
      }
    });
  }
}
