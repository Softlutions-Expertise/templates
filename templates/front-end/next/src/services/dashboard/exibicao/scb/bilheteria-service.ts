import {
  IBilheteria, IBilheteriaFindAll, IBilheteriaFindAllFilter,
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
  payload: IBilheteriaFindAllFilter;
}): Promise<IPaginatedResponse<IBilheteriaFindAll>> {
  const response = await api.local.scb.post(
    `/bilheterias?${assembleParameterArray(params)}`,
    removeEmptyFields(payload),
  );

  return response?.data;
}

async function findOneById(id: number): Promise<IBilheteria> {
  const response = await api.local.scb.get(`/bilheterias/${id}`);

  return response.data;
}

async function remove(id: string | number): Promise<IBilheteriaFindAll> {
  const response = await api.local.scb.delete(`/bilheterias/${id}`);

  return response.data;
}

async function retificar(id: number): Promise<void> {
  await api.local.scb.put(`/ancine/retificar/${id}`);
}

async function enviar(id: number): Promise<void> {
  await api.local.scb.put(`/ancine/enviar/${id}`);
}

async function consultar(id: number): Promise<IBilheteriaFindAll> {
  const { data } = await api.local.scb.put(`/ancine/consultar/${id}`);

  return data;
}

export const bilheteriaService = {
  findAll,
  findOneById,
  remove,
  retificar,
  enviar,
  consultar,
};

