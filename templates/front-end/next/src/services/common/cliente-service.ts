'use client';

import { api } from '@/services';
import { ICliente } from '@/models';

// ----------------------------------------------------------------------

async function filter(search: string): Promise<ICliente[]> {
  const response = await api.income.get(`/clientes/filter?search=${search}`);
  return response.data.content;
}

export const ClienteService = {
  filter,
};
