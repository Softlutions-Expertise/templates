import { ISala } from '@/models';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const informacoesGerais = (currentData?: ISala) => ({
  id: Number(currentData?.id) || undefined,
  descricao: currentData?.descricao || '',
  registroAncine: currentData?.registroAncine || '',
  tipoTela: typeof currentData?.tipoTela === 'object' ? (currentData?.tipoTela as any)?.cod : (currentData?.tipoTela || 0),
  resolucao4k: currentData?.resolucao4k ?? false,
  atmos: currentData?.atmos ?? false,
  tamanhoX: currentData?.tamanhoX || 0,
  tamanhoY: currentData?.tamanhoY || 0,
  inverterY: currentData?.inverterY ?? false,
});

export const salaDefaultValues = (currentData?: ISala) => {
  return useMemo(() => {
    return {
      ...informacoesGerais(currentData),
    };
  }, [currentData]);
};
