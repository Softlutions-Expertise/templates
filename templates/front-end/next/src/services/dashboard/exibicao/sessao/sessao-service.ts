 'use client';

import {
  ISessaoCreate,
  ISessaoEdit,
  ISessaoFindAll,
  IFilmeMenuItem,
  ISessaoContext,
  IPaginatedResponse,
  IPaginationSend,
} from '@/models';
import { api } from '@/services';
import { assembleParameterArray } from '@softlutions/utils';

// ----------------------------------------------------------------------

   async function findAll({ params}: {params: IPaginationSend;}): Promise<IPaginatedResponse<ISessaoFindAll>> {
    const response = await api.booking.get(`/sessao?${assembleParameterArray(params || {})}`);

    return response?.data;
   }

async function searchFilme(search: string): Promise<IFilmeMenuItem[]> {
  const response = await api.booking.get(`/filme/menu?${encodeURIComponent(search)}`);
  return response?.data;
}

async function searchSala(search: string): Promise<any[]> {
  const response = await api.booking.get(`/sala/menu?search=${encodeURIComponent(search)}`);
  return response?.data;
}

async function getSalaDetalhes(id: number): Promise<any> {
  const response = await api.booking.get(`/sala/${id}`);
  return response?.data;
}

async function create(payload: ISessaoCreate): Promise<{ id: number }> {
  const response = await api.booking.post(`/sessao`, payload);

  return response.data;
}

async function show(id: number | string): Promise<ISessaoEdit> {
  const response = await api.booking.get(`/sessao/${id}`);

  return response.data;
}

async function update(id: number | string, payload: ISessaoEdit): Promise<void> {
  const response = await api.booking.put(`/sessao/${id}`, payload);

  return response.data;
}

async function remove(id: number | string): Promise<void> {
  const response = await api.booking.delete(`/sessao/${id}`);

  return response.data;
}

async function context(): Promise<ISessaoContext> {
  const response = await api.booking.get(`/integracao/context`);

  return response.data;
}

export const sessaoService = {
  findAll,
  searchFilme,
  searchSala,
  getSalaDetalhes,
  create,
  show,
  update,
  remove,
  context,
};
