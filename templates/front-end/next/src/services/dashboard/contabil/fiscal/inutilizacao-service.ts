'use client';

import { 
  IInutilizacaoFindAll, 
  IInutilizacaoFindById,
  IInutilizacaoCreateUpdate, 
  IPaginationSend,
  IPaginatedResponse
} from '@/models';
import { api } from '@/services';
import { assembleParameterArray } from '@softlutions/utils';

// ----------------------------------------------------------------------

async function findAll({params}: {params: IPaginationSend}): Promise<IPaginatedResponse<IInutilizacaoFindAll>> {
  const response = await api.local.fiscal.get(`/inutilizacao?${assembleParameterArray(params)}`);

  return response?.data;
}

async function findOneById(id: string | number): Promise<IInutilizacaoFindById> {
  const response = await api.local.fiscal.get(`/inutilizacao/${id}`);
  return response.data;
}

async function create(payload: IInutilizacaoCreateUpdate): Promise<{ id: number }> {
  const response = await api.local.fiscal.post('/inutilizacao', payload);
  return response.data;
}

export const inutilizacaoService = {
  findAll,
  findOneById,
  create,
};
