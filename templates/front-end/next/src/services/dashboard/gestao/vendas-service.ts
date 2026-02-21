'use client';

import {
  IVendasContext,
  IVendasList,
  IVendasListFilter,
  IVendasListParam,
  IVendasPagamento,
  IVendasViewer,
} from '@/models';
import { assembleParameterArray, removeEmptyFields } from '@softlutions/utils';
import { api } from '@/services';
import { getLocalItem, getSessionItem } from '@softlutions/utils';
import axios from 'axios';

// ----------------------------------------------------------------------

interface Props {
  params: IVendasListParam;
  data: IVendasListFilter;
}

async function index({ params, data }: Props): Promise<IVendasList> {
  const { unidadeId, ...restParams } = params;

  const response = await api.income.get(
    `/vendas/search?${assembleParameterArray({ ...restParams, ...removeEmptyFields(data) })}`,
  );

  return response.data;
}

async function show(id: string): Promise<IVendasViewer> {
  const response = await api.income.get(
    `/vendas/${id}`,
  );

  return response.data;
}

async function historico(linkConsultaPagamento: string): Promise<IVendasPagamento> {
  const authorization = await getLocalItem('authorization');
  const response = await axios.get(`${linkConsultaPagamento}`, {
    headers: {
      Authorization: `Bearer ${authorization}`,
      ['x-api-key']: process.env.NEXT_PUBLIC_API_KEY,
    },
  });

  return response.data;
}

async function cancelar(data: Record<string, any>): Promise<IVendasViewer> {
  const finalData = {
    ...data,
    id: getSessionItem('id'),
    unidade: getLocalItem('unidade')?.id,
  };

  const response = await api.income.put(`/venda/cancelar`, finalData);

  return response.data;
}

async function context(): Promise<IVendasContext> {
  const response = await api.income.get(`/integracao/context`);

  return response.data;
}

// ----------------------------------------------------------------------

export const VendasService = {
  index,
  show,
  historico,
  cancelar,
  context,
};
