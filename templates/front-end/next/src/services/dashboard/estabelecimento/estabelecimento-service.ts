'use client';

import { IEstabelecimentoContext } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function context(): Promise<IEstabelecimentoContext> {
  const response = await api.local.views.get(`/integracao/context`);

  return response.data;
}

export const estabelecimentoService = {
  context,
};
