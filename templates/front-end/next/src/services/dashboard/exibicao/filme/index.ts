'use client';

import { IFilmeContext } from '@/models';
import { api } from '@/services';
import { getSessionItem, setSessionItem } from '@softlutions/utils';

// ----------------------------------------------------------------------

async function index(params?: any): Promise<any> {
  const response = await api.booking.get(`/filme/basic`, { params });

  return response.data;
}

async function context(): Promise<IFilmeContext> {
  const sessionData = getSessionItem('context-integracoes-filme');
  if (sessionData) return sessionData;

  const response = await api.booking.get(`/integracao/context`);

  setSessionItem('context-integracoes-filme', response.data);
  return response.data;
}

export const filmeService = {
  index,
  context,
};
