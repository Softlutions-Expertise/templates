'use client';

import { IUnidadeCreateEdit, IUnidadeItem } from '@/models';
import { api, LOCAL_API, locusService } from '@/services';
import { getLocalItem, setLocalItem } from '@softlutions/utils';
import axios from 'axios';

// ----------------------------------------------------------------------

async function findAll({
  unidadeDesativadas = false,
}: {
  unidadeDesativadas?: boolean;
}): Promise<IUnidadeItem[]> {
  const url = unidadeDesativadas ? '/unidade/basics/admin' : '/unidade/basics';
  const response = await api.business.get(url);

  return response.data;
}

async function findOneById(id: string): Promise<IUnidadeCreateEdit> {
  const response = await api.business.get(`/unidade/${id}`);

  const cidade = await locusService.findOneCidadeById(response.data.cidadeIbge);
  return { ...response.data, estadoIbge: cidade.estado };
}

async function findOneByOrigin(origin: string): Promise<IUnidadeCreateEdit> {
  const response = await axios.get(`${origin}/stations/parametros/context`, {
    headers: {
      Authorization: `Bearer ${getLocalItem('authorization')}`,
      ['x-api-key']: process.env.NEXT_PUBLIC_API_KEY || '',
    },
  });

  return response.data;
}

async function update(values: IUnidadeCreateEdit): Promise<any> {
  const response = await api.business.put(`/unidade/${values.id}`, values);

  return response;
}

async function loadCurrentUnidade(): Promise<IUnidadeCreateEdit> {
  // Verifica se já existe no localStorage
  const cachedUnidade = getLocalItem('unidade');
  if (cachedUnidade) {
    return cachedUnidade;
  }
  // Busca da API usando a URL atual
  const origin = LOCAL_API || window.location.origin;
  const unidade = await findOneByOrigin(origin);

  setLocalItem('unidade', unidade);
  return unidade;
}

export const unidadeService = {
  findAll,
  findOneById,
  findOneByOrigin,
  update,
  loadCurrentUnidade,
};
