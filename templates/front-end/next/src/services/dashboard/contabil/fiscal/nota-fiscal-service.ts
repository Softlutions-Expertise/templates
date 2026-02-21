'use client';

import {
  INotaFiscalCreateUpdate,
  INotaFiscalFindAll,
  INotaFiscalFindAllFilter,
  INotaFiscalTransmitir,
  IPaginatedResponse,
  IPaginationSend
} from '@/models';
import { assembleParameterArray, removeEmptyFields } from '@softlutions/utils';

import { api } from '@/services';

// ----------------------------------------------------------------------

async function create(payload: INotaFiscalCreateUpdate): Promise<{ id: number }> {
  const response = await api.local.fiscal.post(`/nota`, payload);

  return response.data;
}

async function creteByXml(file: string): Promise<{ id: number }> {
  let payload = new FormData();

  payload.append('file', file);

  const response = await api.local.fiscal.post('/nota/xml', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

async function findAll({
  params,
  payload,
}: {
  params: IPaginationSend;
  payload: INotaFiscalFindAllFilter;
}): Promise<IPaginatedResponse<INotaFiscalFindAll>> {
  const response = await api.local.fiscal.post(
    `/nota/search?${assembleParameterArray(params)}`,
    removeEmptyFields(payload),
  );

  return response?.data;
}
async function findOneById(id: string | number): Promise<any> {
  const response = await api.local.fiscal.get(`/nota/${id}`);

  return response.data;
}

async function update(payload: INotaFiscalCreateUpdate): Promise<void> {
  const response = await api.local.fiscal.put(`/nota/${payload?.id}`, payload);

  return response.data;
}

async function remove(id: string | number): Promise<INotaFiscalCreateUpdate> {
  const response = await api.local.fiscal.delete(`/nota/${id}`);

  return response.data;
}

async function transmitir(id: string | number): Promise<INotaFiscalTransmitir> {
  const response = await api.local.fiscal.post(`/nota/emitir/${id}`);

  return response.data;
}

async function cancelar(payload: {
  descricao: string;
  id: number;
}): Promise<INotaFiscalCreateUpdate> {
  const response = await api.local.fiscal.put(`/nota/cancelar/${payload.id}`, payload);

  return response.data;
}

async function danfe(id: number): Promise<void> {
  await api.local.fiscal
    .get(`danfe/pdf/${id}`, {
      responseType: 'arraybuffer',
    })
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: res.headers['content-type'] }),
      );
      window.open(url);
    });
}

async function movimentar(id: number): Promise<void> {
  const response = await api.local.fiscal.put(`/nota/movimentar/${id}`);

  return response.data;
}

async function xmlAutorizado(id: number): Promise<void> {
  await api.local.fiscal
    .get(`nota/xml/autorizado/${id}`, {
      responseType: 'arraybuffer',
    })
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/xml' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `nota-fiscal-${id}.xml`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
}

async function cartaCorrecao(payload: {
  justificativa: string;
  id: number;
}): Promise<INotaFiscalCreateUpdate> {
  const response = await api.local.fiscal.put(`/nota/carta-correcao/${payload.id}`, payload);

  return response.data;
}

async function clonar(id: string | number): Promise<void> {
  const response = await api.local.fiscal.post(`/nota/clonar/${id}`);

  return response.data;
}

export const notaFiscalService = {
  create,
  creteByXml,
  findOneById,
  findAll,
  update,
  remove,
  transmitir,
  cancelar,
  danfe,
  movimentar,
  xmlAutorizado,
  cartaCorrecao,
  clonar,
};
