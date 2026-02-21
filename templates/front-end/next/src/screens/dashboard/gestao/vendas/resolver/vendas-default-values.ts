import { useMemo } from 'react';
import { IVendasViewer } from '@/models';

// ----------------------------------------------------------------------

const informacoesGerais = (currentData?: IVendasViewer) => ({
  id: currentData?.id || '',
  localizador: currentData?.localizador || '',
  caixa: currentData?.caixa || '',
  data: currentData?.data || '',
  hora: currentData?.hora || '',
  dataHoraImpressao: currentData?.dataHoraImpressao || '',
  terminalImpressao: currentData?.terminalImpressao || '',
  codigoReserva: currentData?.codigoReserva || '',
  totalDesconto: currentData?.totalDesconto || 0,
  terminal: currentData?.terminal || '',
  operador: currentData?.operador || '',
  origem: currentData?.origem || '',
  observacoes: currentData?.observacoes || '',
  valorTotal: currentData?.valorTotal || 0,
  cliente: {
    id: currentData?.cliente?.id || 0,
    nome: currentData?.cliente?.nome || '',
    email: currentData?.cliente?.email || '',
    telefone: currentData?.cliente?.telefone || '',
    cpfCnpj: currentData?.cliente?.cpfCnpj || '',
  },
  sessao: {
    id: currentData?.sessao?.id || 0,
    data: currentData?.sessao?.data || '',
    hora: currentData?.sessao?.hora || '',
    filme: currentData?.sessao?.filme || '',
    sala: currentData?.sessao?.sala || '',
    tipoSessao: {
      cod: currentData?.sessao?.tipoSessao?.cod || 0,
      descricao: currentData?.sessao?.tipoSessao?.descricao || '',
    },
    tipoProjecao: {
      cod: currentData?.sessao?.tipoProjecao?.cod || 0,
      descricao: currentData?.sessao?.tipoProjecao?.descricao || '',
    },
    idiomaExibicao: {
      cod: currentData?.sessao?.idiomaExibicao?.cod || 0,
      descricao: currentData?.sessao?.idiomaExibicao?.descricao || '',
    },
    resolucao4k: currentData?.sessao?.resolucao4k || false,
    atmos: currentData?.sessao?.atmos || false,
  },
  itens: currentData?.itens || [],
});

export const vendasDefaultValues = (currentData?: IVendasViewer) => {
  return useMemo(() => {
    return {
      ...informacoesGerais(currentData),
    };
  }, [currentData]);
};
