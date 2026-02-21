'use client';

import { IDownloadsCreate } from '@/models';
import { api } from '@/services';
import { fDate } from '@softlutions/utils';

// ----------------------------------------------------------------------

async function create({ dataInicial, dataFinal, tipo }: IDownloadsCreate): Promise<void> {
  const routeMap: Record<string, string> = {
    autorizadas: '/danfe/exporta-xml',
    inutilizacoes: '/inutilizacao/exportar',
  };

  const endpoint = routeMap[tipo?.nome];

  if (!endpoint) {
    throw new Error('Tipo de download inválido');
  }

  const response = await api.local.fiscal.get(endpoint, {
    params: {
      dataStart : fDate('yyyy-MM-dd', dataInicial),
      dataEnd: fDate('yyyy-MM-dd', dataFinal)
    },
    responseType: 'arraybuffer',
  });
  const filename = `${tipo.nome}-${fDate('yyyy-MM-dd', dataInicial)}.zip`;

  const blob = new Blob([response.data], { type: 'application/zip' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

export const downloadService = {
  create,
};
