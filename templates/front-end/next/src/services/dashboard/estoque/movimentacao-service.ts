'use client';

import {
  IMovimentacao,
  IMovimentacaoFindAll,
  IMovimentacaoFilter,
  IPaginatedResponse,
  IPaginationSend,
} from '@/models';
import { api } from '@/services';
import { assembleParameterArray, removeEmptyFields } from '@softlutions/utils';

// ----------------------------------------------------------------------

async function findAll({
  params,
  payload,
}: {
  params: IPaginationSend;
  payload?: IMovimentacaoFilter;
}): Promise<IPaginatedResponse<IMovimentacaoFindAll>> {
  const allParams = {
    ...params,
    ...removeEmptyFields(payload || {}),
  };

  const response = await api.local.warehouse.get(
    `/movimentacao/search?${assembleParameterArray(allParams)}`,
  );

  return response?.data;
}

async function findOneById(id: string | number): Promise<IMovimentacao> {
  const response = await api.local.warehouse.get(`/movimentacao/${id}`);

  return response?.data;
}

async function reverter(id: string | number): Promise<void> {
  await api.local.warehouse.put(`/movimentacao/reverter/${id}`);
}

export const movimentacaoService = {
  findAll,
  findOneById,
  reverter,
};
