import { IInutilizacaoCreateUpdate } from '@/models';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const informacoesDefaultValues = (currentData?: IInutilizacaoCreateUpdate) => ({
  modelo: currentData?.modelo ?? '',
  serie: currentData?.serie || null,
  sequencias: currentData?.sequencias || [],
  justificativa: currentData?.justificativa || '',
  id: currentData?.id,
  dataHora: currentData?.dataHora,
  status: currentData?.status,
  ambiente: currentData?.ambiente,
  protocolo: currentData?.protocolo,
  detalhes: currentData?.detalhes,
  autorizado: currentData?.autorizado,
});

export const inutilizacaoDefaultValues = (currentData?: IInutilizacaoCreateUpdate) => {
  return useMemo(() => {
    return {
      ...informacoesDefaultValues(currentData),
    };
  }, [currentData]);
};
