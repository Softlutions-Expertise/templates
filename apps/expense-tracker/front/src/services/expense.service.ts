import { api } from './api';

// ----------------------------------------------------------------------

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
  notes?: string;
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  date: string;
  categoryId?: string;
  notes?: string;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}

// ----------------------------------------------------------------------

export const expenseService = {
  list: async (params?: { page?: number; limit?: number; filters?: ExpenseFilters }) => {
    const response = await api.get('/expenses', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        ...params?.filters,
      },
    });
    return response.data;
  },

  getRecent: async (limit: number = 5) => {
    const response = await api.get(`/expenses/recent?limit=${limit}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  create: async (data: CreateExpenseData) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  update: async (id: string, data: UpdateExpenseData) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  getMonthlyStats: async (year: number, month: number) => {
    const response = await api.get(`/expenses/stats/monthly?year=${year}&month=${month}`);
    return response.data;
  },
};
