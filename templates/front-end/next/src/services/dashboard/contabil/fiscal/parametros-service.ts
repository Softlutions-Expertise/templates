'use client';

import { IParametroUpdate } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function findOneById(): Promise<IParametroUpdate> {
  const response = await api.local.fiscal.get('/parametros');

  return response.data;
}

async function update(data: IParametroUpdate): Promise<void> {
  const { certificadoDigital, ...restData } = data;

  let formData = new FormData();

  formData.append(
    'parametros',
    new Blob([JSON.stringify(restData)], {
      type: 'application/json',
    }),
  );

  if (certificadoDigital instanceof File) {
    formData.append('file', certificadoDigital, certificadoDigital.name);
  }

  const response = await api.local.fiscal.put('/parametros', formData);

  return response.data;
}

export const parametrosService = {
  update,
  findOneById,
};
