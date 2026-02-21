'use client';

import { IRegraTributariaCreateUpdate, IRegraTributariaFindAll, IRegraTributariaFindOne } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function findAll(): Promise<IRegraTributariaFindAll[]> {
  const response = await api.local.fiscal.get('/regras');
  return response?.data;
}

async function create(payload: IRegraTributariaCreateUpdate): Promise<{ id: number }> {
  const response = await api.local.fiscal.post('/regras', payload);
  return response.data;
}

async function findOneById(id: number): Promise<IRegraTributariaFindOne> {
  const response = await api.local.fiscal.get(`/regras/${id}`);
  return response.data;
}

async function update(id: number, payload: IRegraTributariaCreateUpdate): Promise<void> {
  const response = await api.local.fiscal.put(`/regras/${id}`, payload);
  return response.data;
}

export const regraTributariaService = {
  create,
  findOneById,
  findAll,
  update,
};
