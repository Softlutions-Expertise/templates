'use client';

import { IEstoqueContext } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function context(): Promise<IEstoqueContext> {
  const response = await api.local.warehouse.get(`/integracao/context`);

  return response.data;
}

export const estoqueService = {
  context,
};
