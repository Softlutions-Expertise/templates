'use client';

import { api } from '@/services';
import { ICaixa } from '@/models';

// ----------------------------------------------------------------------

async function menu(dataInicial: string, dataFinal: string): Promise<ICaixa[]> {
  const response = await api.cashbox.get(`/caixas/menu?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
  return response.data;
}

export const CaixaService = {
  menu,
};
