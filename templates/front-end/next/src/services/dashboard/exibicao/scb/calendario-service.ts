
import {
  CalendarMonthlyData,
  CalendarYearlyData
} from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function getMonthlyView(year: number, month: number): Promise<CalendarMonthlyData> {
  const response = await api.local.scb.get(`/bilheterias/view/mensal/${year}/${month}`);

  return response.data;
}

async function getYearlyView(year: number): Promise<CalendarYearlyData[]> {
  const response = await api.local.scb.get(`/bilheterias/view/anual/${year}`);

  return response.data;
}

async function enviarBilheteria(data: string): Promise<any> {
  const response = await api.local.scb.put(`/ancine/enviar?data=${data}`);

  return response.data;
}

export const calendarioService = {
  getMonthlyView,
  getYearlyView,
  enviarBilheteria,
};

