'use client';

import { IFiscalContext, IFiscalMercadoria } from '@/models';

import { api } from '@/services';

// ----------------------------------------------------------------------

async function context(): Promise<IFiscalContext> {
  const response = await api.local.fiscal.get(`/integracao/context`);

  return response.data;
}

async function findAllMercadoria(value?: string): Promise<IFiscalMercadoria[]> {
  const response = await api.local.fiscal.get(`/mercadoria/search?busca=${value || ''}`);

  return response.data;
}

export const fiscalService = {
  context,
  findAllMercadoria,
};
