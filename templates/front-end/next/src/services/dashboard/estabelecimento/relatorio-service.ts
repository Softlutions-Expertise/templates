'use client';

import { IRelatorioCreate } from '@/models';
import { assembleParameterArray, getLocalItem } from '@softlutions/utils';
import axios from 'axios';

// ----------------------------------------------------------------------

async function create(data: IRelatorioCreate): Promise<any> {
  const { unidade, relatorio, ...rest } = data;

  await axios
    .get(
      `${unidade}${relatorio.rota}?${assembleParameterArray(rest)}`,
      {
        headers: {
          Authorization: `Bearer ${getLocalItem('authorization')}`,
          ['x-api-key']: process.env.NEXT_PUBLIC_API_KEY || '',
        },
        responseType: 'arraybuffer',
      },
    )
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: res.headers['content-type'] }),
      );
      window.open(url);
    });
}

export const relatorioService = {
  create,
};
