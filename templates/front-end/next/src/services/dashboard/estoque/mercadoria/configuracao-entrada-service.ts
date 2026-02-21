'use client';

import {
  IConfiguracaoEntradaCreateUpdate,
  IConfiguracaoEntradaFindAll,
  IConfiguracaoEntradaMercadoriaFilter,
  IPaginatedResponse,
  IPaginationSend
} from '@/models';
import { api } from '@/services';
import { assembleParameterArray, removeEmptyFields } from '@softlutions/utils';

// ----------------------------------------------------------------------

async function findAll({
  params,
  payload,
}: {
  params: IPaginationSend;
  payload: IConfiguracaoEntradaMercadoriaFilter;
}): Promise<IPaginatedResponse<IConfiguracaoEntradaFindAll>> {
  const response = await api.local.warehouse.post(
    `/fornecedor/mercadoria/search?${assembleParameterArray(params)}`,
    removeEmptyFields(payload)
  );

  return response?.data;
}
async function findOneById(id: string | number): Promise<IConfiguracaoEntradaCreateUpdate> {
  const response = await api.local.warehouse.get(`/fornecedor/mercadoria/${id}`);

  return response.data;
}

async function searchFts(search: string) {
  const response = await api.local.warehouse.get(`/fornecedor/fts?search=${search}`);
  return response?.data;
}

async function create(payload: IConfiguracaoEntradaCreateUpdate): Promise<{ id: number }> {
  const response = await api.local.warehouse.post(`/fornecedor/mercadoria`, payload);

  return response.data;
}

async function update(data: IConfiguracaoEntradaCreateUpdate): Promise<void> {
  const response = await api.local.warehouse.put(`/fornecedor/mercadoria/${data?.id}`, data);

  return response.data;
}


export const configuracaoEntradaService = {
  findAll,
  searchFts,
  create,
  findOneById,
  update,
};
