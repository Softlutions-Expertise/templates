import { reportsService } from "../../../../reports/reports.service";
import {
  AuditoriaReportInput,
  AuditoriaReportRow,
  TipoAcao,
} from "../../../../reports/templates/modules/auditoria/auditoria-report.types";

// ----------------------------------------------------------------------

export interface GenerateAuditoriaReportDto {
  filters: {
    startDate?: string;
    endDate?: string;
    acao?: TipoAcao;
    entidade?: string;
  };
  rows: Array<{
    id: string;
    data: string;
    usuario: string;
    acao: TipoAcao;
    entidade: string;
    descricao?: string;
    ipAddress?: string;
  }>;
  totalRecords: number;
}

// ----------------------------------------------------------------------

export class GenerateReportService {
  async generateAuditoriaReport(dto: GenerateAuditoriaReportDto): Promise<string> {
    const input: AuditoriaReportInput = {
      filters: {
        startDate: dto.filters.startDate ? new Date(dto.filters.startDate) : undefined,
        endDate: dto.filters.endDate ? new Date(dto.filters.endDate) : undefined,
        acao: dto.filters.acao,
        entidade: dto.filters.entidade,
      },
      rows: dto.rows.map((row) => ({
        id: row.id,
        data: row.data,
        usuario: row.usuario,
        acao: row.acao,
        acaoLabel: this.getAcaoLabel(row.acao),
        entidade: row.entidade,
        descricao: row.descricao || "",
        ipAddress: row.ipAddress || "",
      })),
      totalRecords: dto.totalRecords,
      generatedAt: new Date(),
    };

    return reportsService.generateAuditoriaReport(input);
  }

  private getAcaoLabel(acao: TipoAcao): string {
    const labels: Record<TipoAcao, string> = {
      [TipoAcao.LOGIN]: "Login",
      [TipoAcao.CREATE]: "Criação",
      [TipoAcao.UPDATE]: "Atualização",
      [TipoAcao.DELETE]: "Exclusão",
    };
    return labels[acao];
  }
}

// Singleton
export const generateReportService = new GenerateReportService();
