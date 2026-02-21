import { IPainelDigitalCreateEdit, IPainelDigitalInformacoes } from '@/models';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const informacoesDefaultValues = (currentData?: IPainelDigitalInformacoes) => ({
  ativo: currentData?.ativo || false,
  nome: currentData?.nome || '',
  ip: currentData?.ip || '',
  tipoPainel: currentData?.tipoPainel || 0,
});

export const painelDigitalDefaultValues = (currentData?: IPainelDigitalCreateEdit) => {
  return useMemo(() => {
    return {
      ...informacoesDefaultValues(currentData),
    };
  }, [currentData]);
};
