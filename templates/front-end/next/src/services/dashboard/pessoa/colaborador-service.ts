'use client';

import {
  IColaborador,
  IColaboradorCreateUpdate,
  IColaboradorListParams,
  IColaboradorListResponse,
  IColaboradorChangePassword,
  IColaboradorList,
} from '@/models';
import { assembleParameterArray } from '@softlutions/utils';
import { api } from '@/services';

// ----------------------------------------------------------------------
// Backend routes: /api/pessoas/colaboradores (plural, RESTful)
const BASE_URL = '/pessoas/colaboradores';

// Mapeia os dados do backend (aninhados) para o formato plano da lista
function mapColaboradorList(item: any): IColaboradorList {
  return {
    id: item.id,
    nome: item.pessoa?.nome || '',
    cpf: item.pessoa?.cpf || '',
    username: item.usuario?.usuario || '',
    nivelAcesso: item.usuario?.nivelAcesso || '',
    cargo: item.cargo,
    instituicaoNome: item.instituicaoNome,
    ativo: item.usuario?.ativo ?? true,
  };
}

async function index(
  params: IColaboradorListParams,
): Promise<IColaboradorListResponse> {
  const queryString = assembleParameterArray(params);
  const response = await api.offauth.get(`${BASE_URL}?${queryString}`);
  
  // Adapta a resposta do nestjs-paginate para o formato esperado
  const data = response?.data;
  const content = (data.data || []).map(mapColaboradorList);
  
  return {
    content,
    page: {
      number: data.meta?.currentPage || 0,
      size: data.meta?.itemsPerPage || 10,
      offset: 0,
      totalElements: data.meta?.totalItems || 0,
      totalPages: data.meta?.totalPages || 0,
    },
  };
}

async function create(data: IColaboradorCreateUpdate): Promise<{ id: string }> {
  const response = await api.offauth.post(BASE_URL, data);
  return response.data;
}

async function update(id: string, data: IColaboradorCreateUpdate): Promise<void> {
  const response = await api.offauth.patch(`${BASE_URL}/${id}`, data);
  return response.data;
}

async function remove(id: string): Promise<void> {
  const response = await api.offauth.delete(`${BASE_URL}/${id}`);
  return response.data;
}

async function show(id: string): Promise<IColaborador> {
  const response = await api.offauth.get(`${BASE_URL}/${id}`);
  return response.data;
}

async function findByCpf(cpf: string): Promise<IColaborador> {
  const response = await api.offauth.get(`${BASE_URL}/cpf/${cpf}`);
  return response.data;
}

async function getForMap(cidadeId?: string): Promise<IColaborador[]> {
  const params = cidadeId ? `?filter.cidadeId=${cidadeId}` : '';
  const response = await api.offauth.get(`${BASE_URL}/mapa/coordenadas${params}`);
  return response.data;
}

async function changePassword(data: IColaboradorChangePassword): Promise<void> {
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
  findByCpf,
  getForMap,
  changePassword,
};
