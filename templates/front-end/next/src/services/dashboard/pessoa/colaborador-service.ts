'use client';

import {
  IColaboradorList,
  IColaboradorShow,
  IColaboradorCreateUpdate,
  IPaginatedResponse,
  IPaginationParams,
} from '@/models';
import { assembleParameterArray, removeEmptyFields } from '@softlutions/utils';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function index(data: IPaginationParams,
): Promise<IPaginatedResponse<IColaboradorList>> {
  const response = await api.offauth.get(`/colaboradores?${assembleParameterArray(data)}`);

  return response?.data;
}

async function create(data: IColaboradorCreateUpdate): Promise<{ id: number }> {
  const response = await api.offauth.post('/colaboradores', data);
  return response.data;
}

async function update(id: number, data: IColaboradorCreateUpdate): Promise<void> {
  const response = await api.offauth.put(`/colaboradores/${id}`, data);
  return response.data;
}

async function remove(id: number): Promise<void> {
  const response = await api.offauth.delete(`/colaboradores/${id}`);
  return response.data;
}

async function show(id: number | string): Promise<IColaboradorShow> {
  const response = await api.offauth.get(`/colaboradores/${id}`);

  return response.data;
}

async function changePassword(data: { username: string; password: string }): Promise<void> {
  const response = await api.offauth.put('/auth/change-password', data);
  return response.data;
}

// ----------------------------------------------------------------------

export const ColaboradorService = {
  index,
  create,
  update,
  remove,
  show,
  changePassword,
};
