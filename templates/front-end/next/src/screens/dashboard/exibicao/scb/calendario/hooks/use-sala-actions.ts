'use client';

import { pages, useRouter } from '@/routes';
import { bilheteriaService } from '@/services';
import { useError } from '@softlutions/hooks';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

interface UseSalaActionsProps {
  setReloadSalas: (reload: boolean) => void;
  onCloseModal: () => void;
}

interface UseSalaActionsReturn {
  loadingRetificar: boolean;
  loadingEnviar: boolean;
  loadingConsultar: boolean;
  handleSalaRetificar: (sala: any) => void;
  handleSalaEnviar: (sala: any) => void;
  handleSalaConsultar: (sala: any) => Promise<void>;
  handleViewer: (sala: any) => void;
}

export default function useSalaActions({
  setReloadSalas,
  onCloseModal
}: UseSalaActionsProps): UseSalaActionsReturn {
  const router = useRouter();
  const handleError = useError()

  const [loadingRetificar, setLoadingRetificar] = useState<boolean>(false);
  const [loadingEnviar, setLoadingEnviar] = useState<boolean>(false);
  const [loadingConsultar, setLoadingConsultar] = useState<boolean>(false);

  const extractSalaId = (sala: any): number => {
    return sala.extendedProps?.sala?.id || sala.sala?.id || parseInt(sala.id.split('-')[1]);
  };

  const handleSalaRetificar = (sala: any) => {
    const salaId = extractSalaId(sala);

    setLoadingRetificar(true);

    bilheteriaService.retificar(salaId)
      .then(() => {
        enqueueSnackbar('Bilheteria retificada com sucesso');
        setReloadSalas(true);
        onCloseModal();
      })
      .catch((error) => {
        const msg = error?.response?.data?.message || 'Erro ao retificar bilheteria';
        handleError(error, msg);
      })
      .finally(() => {
        setLoadingRetificar(false);
      });
  };

  const handleSalaEnviar = (sala: any) => {
    const salaId = extractSalaId(sala);

    setLoadingEnviar(true);

    bilheteriaService.enviar(salaId)
      .then(() => {
        enqueueSnackbar('Bilheteria enviada com sucesso');
        setReloadSalas(true);
        onCloseModal();
      })
      .catch((error) => {
        const msg = error?.response?.data?.message || 'Erro ao enviar bilheteria';
        handleError(error, msg);
      })
      .finally(() => {
        setLoadingEnviar(false);
      });
  };

  const handleSalaConsultar = async (sala: any) => {
    const salaId = extractSalaId(sala);

    setLoadingConsultar(true);

    try {
      await bilheteriaService.consultar(salaId);
      enqueueSnackbar('Consulta realizada com sucesso');
      setReloadSalas(true);
      onCloseModal();
    } catch (error) {
      const msg = error?.response?.data?.message || 'Erro ao consultar bilheteria';
      handleError(error, msg);
    } finally {
      setLoadingConsultar(false);
    }
  };

  const handleViewer = (sala: any) => {
    const salaId = extractSalaId(sala);
    router.push(pages.dashboard.exibicao.scb.bilheteria.viewer.path(salaId));
  };

  return {
    loadingRetificar,
    loadingEnviar,
    loadingConsultar,
    handleSalaRetificar,
    handleSalaEnviar,
    handleSalaConsultar,
    handleViewer,
  };
}
