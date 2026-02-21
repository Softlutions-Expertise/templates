import { useMemo } from 'react';

export const SessaoDefaultValues = (currentData?: any) => {
  return useMemo(() => {
    if (currentData && currentData.data && currentData.hora) {
      return {
        id: currentData.id,
        filme: currentData.filme || null,
        data: currentData.data ? new Date(currentData.data) : null,
        hora: currentData.hora?.substring(0, 5) ?? currentData.hora,
        sala: currentData.sala?.id ?? currentData.sala,
        salaRendas: currentData.salaRendas?.id ?? currentData.salaRendas,
        tipoSessao: currentData.tipoSessao?.cod ?? currentData.tipoSessao ?? 0,
        tipoProjecao: currentData.tipoProjecao?.cod ?? currentData.tipoProjecao ?? 0,
        idiomaExibicao: currentData.idiomaExibicao?.cod ?? currentData.idiomaExibicao ?? 0,
        resolucao4k: currentData.resolucao4k ?? false,
        atmos: currentData.dolbyAtmos ?? false,
        libras: currentData.libras ?? false,
        legendaDescritiva: currentData.legendaDescritiva ?? false,
        audioDescricao: currentData.audioDescricao ?? false,
        valoresPadrao: currentData.valores?.["0"] ?? {},
        valoresPromocao: currentData.valores?.["3"] ?? {},
        venderPdv: currentData.venderPdv ?? false,
        venderWeb: currentData.venderWeb ?? false,
        venderAtm: currentData.venderAtm ?? false,
      };
    }

    return {
      filme: currentData?.filme ?? null,
      dataInicio: currentData?.dataInicio ? new Date(currentData.dataInicio) : null,
      dataFim: currentData?.dataFim ? new Date(currentData.dataFim) : null,
      horarios: currentData?.horarios ?? [],
    };
  }, [currentData]);
};
