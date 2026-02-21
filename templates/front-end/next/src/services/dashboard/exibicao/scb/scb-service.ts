'use client';

import { IScbContext } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function context(): Promise<IScbContext> {
  const response = await api.local.scb.get(`/parametros/context`);

  return response.data;
}

export const scbService = {
  context,
};
