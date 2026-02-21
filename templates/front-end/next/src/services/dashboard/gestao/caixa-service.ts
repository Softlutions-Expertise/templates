'use client';

import {
  ICaixaAbertura,
  ICaixaAberturaResponse,
  ICaixaContext,
  ICaixaFechamento,
  ICaixaFindAll,
  ICaixaFindAllFilter,
  ICaixaFindOne,
  ICaixaVerifyAbertura,
  IPaginatedResponse,
  IPaginationSend,
} from '@/models';
import { assembleParameterArray, removeEmptyFields } from '@softlutions/utils';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function abertura(data: ICaixaAbertura): Promise<ICaixaAberturaResponse> {
  const response = await api.cashbox.post(`/caixas/abertura`, data);
  return response.data;
}

async function findOneById(id: string | number): Promise<ICaixaFindOne> {
  const response = await api.cashbox.get(`/caixas/${id}`);
  return response.data;
}

async function findAll({
  params,
  data,
}: {
  params: IPaginationSend;
  data: ICaixaFindAllFilter;
}): Promise<IPaginatedResponse<ICaixaFindAll>> {
  const response = await api.cashbox.post(
    `/caixas/search?${assembleParameterArray(params)}`,
    removeEmptyFields(data),
  );
  return response.data;
}

async function fechamento(data: ICaixaFechamento): Promise<ICaixaAberturaResponse> {
  const { id, ...restData } = data;

  const response = await api.cashbox.put(`/caixas/fechamento/${id}`, restData);
  return response.data;
}

async function verifyAbertura(data: ICaixaVerifyAbertura): Promise<ICaixaAberturaResponse> {
  const response = await api.cashbox.get(`/caixas/verify?${assembleParameterArray(data)}`);
  return response.data;
}

async function context(): Promise<ICaixaContext> {
  const response = await api.pay.get(`/parametros/context`);
  return response.data;
}

export const caixaService = {
  abertura,
  findOneById,
  findAll,
  fechamento,
  verifyAbertura,
  context,
};
