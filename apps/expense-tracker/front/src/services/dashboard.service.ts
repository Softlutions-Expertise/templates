import { api } from './api';

// ----------------------------------------------------------------------

export interface DashboardSummary {
  totalMonth: number;
  totalAll: number;
  countMonth: number;
  countAll: number;
  byCategory: Array<{
    name: string;
    amount: number;
    color: string;
  }>;
}

export interface ChartData {
  month: string;
  total: number;
  count: number;
}

// ----------------------------------------------------------------------

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  getChartData: async (months: number = 6): Promise<ChartData[]> => {
    const response = await api.get(`/dashboard/chart-data?months=${months}`);
    return response.data;
  },
};
