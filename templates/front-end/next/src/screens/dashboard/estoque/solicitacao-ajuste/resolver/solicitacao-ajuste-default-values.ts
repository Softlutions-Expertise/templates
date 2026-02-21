import {
  ISolicitacaoAjusteCreateUpdate,
  ISolicitacaoAjusteHistorico,
  ISolicitacaoAjusteMercadoria,
} from '@/models';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const mercadoriaDefaultValues = (currentData?: ISolicitacaoAjusteMercadoria) => ({
  status: currentData?.status ?? '',
  comentario: currentData?.comentario || '',
  itens: currentData?.itens || [],
});

const historicoDefaultValues = (currentData?: ISolicitacaoAjusteHistorico) => ({
  historico: currentData?.historico || [],
});

export const solicitacaoAjusteDefaultValues = (currentData?: ISolicitacaoAjusteCreateUpdate) => {
  return useMemo(() => {
    return {
      ...mercadoriaDefaultValues(currentData),
      ...historicoDefaultValues(currentData),
      disabledForm: currentData?.status && currentData?.status?.cod !== 0,
    };
  }, [currentData]);
};
