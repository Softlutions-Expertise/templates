import { IMercadoriaInformacoesGerais, IMercadoriaUpdate } from '@/models';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const informacoesGerais = (currentData?: IMercadoriaInformacoesGerais) => ({
  ativo: currentData?.ativo ?? false,
  venderWeb: currentData?.venderWeb ?? false,
  venderPdv: currentData?.venderPdv ?? false,
  venderAutoatendimento: currentData?.venderAutoatendimento ?? false,
  operacaoEstoque: currentData?.operacaoEstoque ?? false,
  id: Number(currentData?.id) || '',
  descricao: currentData?.descricao || '',
  codigoBarras: currentData?.codigoBarras || '',
  mercadoriaOperacao: currentData?.mercadoriaOperacao?.descricao ?? '',
  unidadeMedida: currentData?.unidadeMedida?.cod ?? '',
  informacaoAdicional: currentData?.informacaoAdicional || '',
  qrCode: currentData?.qrCode || '',
  grupoMercadoria: currentData?.grupoMercadoria?.descricao ?? '',
  valorVenda: currentData?.valorVenda || '',
  valorCusto: currentData?.valorCusto || '',
  ncm: currentData?.ncm || '',
  cest: currentData?.cest || '',
  saldoAtual: currentData?.saldoAtual ?? 0,
  saldoMinimoWeb: currentData?.saldoMinimoWeb ?? 0,
  saldoMinimoAutoatendimento: currentData?.saldoMinimoAutoatendimento ?? 0,
  saldoMinimoPdv: currentData?.saldoMinimoPdv ?? 0,
  observacoes: currentData?.observacoes || '',
  regraTributaria: currentData?.regraTributaria?.cod ?? '',
  totalizador: currentData?.totalizador ?? false,
});

const componenteDefaultValues = (currentData?: IMercadoriaUpdate) => {
  const componentes = currentData?.componentes?.length 
    ? currentData.componentes.map((item: any) => ({
        id: item.id,
        searchMercadoria: { id: item.id, descricao: item.descricao } as any,
        descricao: typeof item.tipoComponente === 'object' ? item.tipoComponente.descricao : '',
        tipoComponente: typeof item.tipoComponente === 'object' ? item.tipoComponente.cod : item.tipoComponente,
        quantidade: item.quantidade,
        ativo: item.ativo ?? true,
        deletar: false,
        valorTotalItem: item.valorTotalItem ?? 0,
        valorUnitario: item.valorUnitario ?? 0,
      }))
    : [];

  return { componentes };
};

export const mercadoriaDefaultValues = (currentData?: IMercadoriaUpdate) => {
  return useMemo(() => {
    return {
      ...informacoesGerais(currentData),
      ...componenteDefaultValues(currentData),
    };
  }, [currentData]);
};
