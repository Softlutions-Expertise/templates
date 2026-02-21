import {
  ISerieNfeCreateUpdate,
} from '@/models';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const informacoesGeraisDefaultValues = (currentData?: ISerieNfeCreateUpdate) => ({
    id: Number(currentData?.id) || '',
    ambiente: currentData?.ambiente?.cod || '',
    modelo: currentData?.modelo?.cod || '',
    serie: currentData?.serie || null,
    numero: currentData?.numeracao || null,
    padrao: currentData?.padrao || false,
    descricao: currentData?.descricao || '',
});

export const serieNfeDefaultValues = (currentData?: ISerieNfeCreateUpdate) => {
  return useMemo(() => {
    return {
      ...informacoesGeraisDefaultValues(currentData),
    };
  }, [currentData]);
};
