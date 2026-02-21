'use client';

import { api } from '@/services';
import { getSessionItem, setSessionItem } from '@softlutions/utils';

// ----------------------------------------------------------------------

async function findAllPais(): Promise<any> {
  const sessionData = getSessionItem('context-integracoes-pais');
  if (sessionData) return sessionData;

  const response = await api.locus.get(`/pais`);

  setSessionItem('context-integracoes-pais', response.data);
  return response.data;
}

async function findAllEstado(): Promise<any> {
  const response = await api.locus.get(`/uf`);

  return response.data;
}

async function findAllCidadeByIdEstado(estado: any): Promise<any> {
  const response = await api.locus.get(`/cidades?uf=${estado}`);

  return response.data;
}

async function findOneCidadeById(id: any): Promise<any> {
  const response = await api.locus.get(`/cidade/${id}`);

  return response.data;
}

async function findOneEnderecoByCep(cep: any): Promise<any> {
  const response = await api.locus.get(`/cep?cep=${cep}`);

  return response.data;
}

export const locusService = {
  findAllPais,
  findAllEstado,
  findAllCidadeByIdEstado,
  findOneCidadeById,
  findOneEnderecoByCep,
};
