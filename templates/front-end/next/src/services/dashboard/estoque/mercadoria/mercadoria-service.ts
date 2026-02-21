'use client';

import {
  IMercadoriaFindAll,
  IMercadoriaUpdate,
  IPaginatedResponse,
  IPaginationParams,
} from '@/models';
import { assembleParameterArray } from '@softlutions/utils';

import { api } from '@/services';

// ----------------------------------------------------------------------

async function findAll(
  data: IPaginationParams,
): Promise<IPaginatedResponse<IMercadoriaFindAll>> {
  const response = await api.local.warehouse.get(`/mercadoria?${assembleParameterArray(data)}`);

  return response?.data;
}

async function findOneById(id: string | number): Promise<IMercadoriaUpdate> {
  const response = await api.local.warehouse.get(`/mercadoria/${id}`);

  return response.data;
}

async function update(data: IMercadoriaUpdate): Promise<void> {
  const response = await api.local.warehouse.put(`/mercadoria/${data?.id}`, data);

  return response.data;
}

async function searchFts(search: string) {
  const response = await api.local.warehouse.get(`/mercadoria/fts?search=${search}`);
  return response?.data;
}

export const mercadoriaService = {
  findAll,
  findOneById,
  update,
  searchFts
};
