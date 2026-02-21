import { IConfiguracaoEntradaCreateUpdate } from '@/models';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const informacoesGerais = (currentData?: IConfiguracaoEntradaCreateUpdate) => ({
  id: Number(currentData?.id) || undefined,
  fornecedor: currentData?.fornecedor || null,
  mercadoriaLocal: currentData?.mercadoriaLocal || null,
  unidadeMedidaDestino: currentData?.unidadeMedidaDestino?.cod ?? 59,
  unidadeMedidaOrigem: currentData?.unidadeMedidaOrigem ?? '',
  fatorConversao: currentData?.fatorConversao || null,
  codigoBarras: currentData?.codigoBarras || '',
  codigoProduto: currentData?.codigoProduto || '',
  descricao: currentData?.descricao || '',
});

export const fornecedorDefaultValues = (currentData?: IConfiguracaoEntradaCreateUpdate) => {
  return useMemo(() => {
    return {
      ...informacoesGerais(currentData),
    };
  }, [currentData]);
};
