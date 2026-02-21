'use client';

import {
  IFiscalMercadoria,
  IPaginatedResponse,
  IPaginationParams,
  ISolicitacaoAjusteCreateUpdate,
  ISolicitacaoAjusteDecidir,
  ISolicitacaoAjusteFindAll,
} from '@/models';
import { api } from '@/services';
import { assembleParameterArray } from '@softlutions/utils';

// ----------------------------------------------------------------------

async function create(data: ISolicitacaoAjusteCreateUpdate): Promise<{ id: number }> {
  const response = await api.local.warehouse.post(`/ajuste`, data);

  return response.data;
}

async function findAll(
  data: IPaginationParams,
): Promise<IPaginatedResponse<ISolicitacaoAjusteFindAll>> {
  const response = await api.local.warehouse.get(`/ajuste?${assembleParameterArray(data)}`);

  return response?.data;
}

async function findOneById(id: string | number): Promise<ISolicitacaoAjusteCreateUpdate> {
  const response = await api.local.warehouse.get(`/ajuste/${id}`);

  return response.data;
}

async function update(data: ISolicitacaoAjusteCreateUpdate): Promise<void> {
  const response = await api.local.warehouse.put(`/ajuste/${data?.id}`, data);

  return response.data;
}

async function enviar(id: string | number): Promise<ISolicitacaoAjusteCreateUpdate> {
  const response = await api.local.warehouse.post(`/ajuste/enviar/${id}`);

  return response.data;
}

async function decidir(
  data: ISolicitacaoAjusteDecidir,
): Promise<ISolicitacaoAjusteCreateUpdate> {
  const response = await api.local.warehouse.post(`/ajuste/decidir/${data?.id}`, data);

  return response.data;
}

async function findAllMercadoria(value?: string): Promise<IFiscalMercadoria[]> {
  const response = await api.local.warehouse.get(`/mercadoria/fts?search=${value || ''}`);

  return response.data.content.map((item: any) => ({
    ...item,
    descricao: item.nome,
  }));
}

export const solicitacaoAjusteService = {
  create,
  findAll,
  findOneById,
  update,
  enviar,
  decidir,
  findAllMercadoria,
};
