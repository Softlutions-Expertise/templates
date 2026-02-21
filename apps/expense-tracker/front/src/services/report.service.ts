import { api } from './api';

// ----------------------------------------------------------------------

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
}

export interface AuditoriaReportFilters {
  startDate?: string;
  endDate?: string;
  acao?: 'login' | 'create' | 'update' | 'delete';
  entidade?: string;
}

// ----------------------------------------------------------------------

export const reportService = {
  generateReport: async (filters: ReportFilters): Promise<string> => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await api.get(`/reports/expenses?${params.toString()}`);
    return response.data;
  },

  downloadReport: async (filters: ReportFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await api.get(`/reports/expenses/pdf?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  generateAuditoriaReport: async (filters: AuditoriaReportFilters): Promise<string> => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.acao) params.append('acao', filters.acao);
    if (filters.entidade) params.append('entidade', filters.entidade);

    const response = await api.get(`/reports/auditoria?${params.toString()}`);
    return response.data;
  },

  downloadAuditoriaReportPdf: async (filters: AuditoriaReportFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.acao) params.append('acao', filters.acao);
    if (filters.entidade) params.append('entidade', filters.entidade);

    const response = await api.get(`/reports/auditoria/pdf?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
