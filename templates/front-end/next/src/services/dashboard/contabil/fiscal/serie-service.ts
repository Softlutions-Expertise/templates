'use client';

import { ISerieFindAll, ISerieNfeCreateUpdate } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function findAll(): Promise<ISerieFindAll[]> {
  const response = await api.local.fiscal.get('/serie');
  return response?.data;
}

async function create(payload: ISerieNfeCreateUpdate): Promise<{ id: number }> {
  const response = await api.local.fiscal.post(`/serie`, payload);

  return response.data;
}

async function findOneById(ambiente: string | number, modelo: string | number, serie: number): Promise<ISerieNfeCreateUpdate> {
  const response = await api.local.fiscal.get(`/serie/${ambiente}/${modelo}/${serie}`);

  return response.data;
}

async function update(payload: ISerieNfeCreateUpdate): Promise<void> {
  const body = {
    descricao: payload.descricao,
    numero: payload.numero,
    padrao: payload.padrao
  };

  const response = await api.local.fiscal.put(`/serie/${payload.ambiente}/${payload.modelo}/${payload.serie}`, body);

  return response.data;
}

export const serieService = {
  create,
  findOneById,
  findAll,
  update,
};
