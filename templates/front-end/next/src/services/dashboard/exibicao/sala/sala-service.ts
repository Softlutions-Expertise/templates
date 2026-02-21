'use client';

import { ISala, ISalaFindAll } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function findAll(): Promise<ISalaFindAll[]> {
  const response = await api.booking.get(`/sala`);

  return response?.data;
}

async function create(payload: ISala): Promise<{ id: number }> {
  const response = await api.booking.post(`/sala`, payload);

  return response.data;
}

async function show(id: number | string): Promise<ISala> {
  const response = await api.booking.get(`/sala/${id}`);

  return response.data;
}

async function update(id: number | string, payload: ISala): Promise<void> {
  const response = await api.booking.put(`/sala/${id}`, payload);

  return response.data;
}

async function remove(id: number | string): Promise<void> {
  const response = await api.booking.delete(`/sala/${id}`);

  return response.data;
}

async function context(): Promise<any> {
  const response = await api.booking.get(`/integracao/context`);

  return response.data;
}

export const salaService = {
  findAll,
  create,
  show,
  update,
  remove,
  context,
};
