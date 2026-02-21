'use client';

import { useError } from '@softlutions/hooks';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

import { calendarioService } from '@/services/dashboard/exibicao/scb/calendario-service';

interface UseEmptyDateActionsProps {
  setReloadSalas: (reload: boolean) => void;
}

interface UseEmptyDateActionsReturn {
  emptyDateModal: { open: boolean; date: string | null };
  loadingConfirmar: boolean;
  setEmptyDateModal: (modal: { open: boolean; date: string | null }) => void;
  handleEnviarBilheteria: (date: string) => Promise<void>;
}

export default function useEmptyDateActions({
  setReloadSalas,
}: UseEmptyDateActionsProps): UseEmptyDateActionsReturn {
  const handleError = useError();

  const [emptyDateModal, setEmptyDateModal] = useState<{ open: boolean; date: string | null }>({
    open: false,
    date: null,
  });
  const [loadingConfirmar, setLoadingConfirmar] = useState<boolean>(false);

  const handleEnviarBilheteria = async (date: string) => {
    setLoadingConfirmar(true);

    try {
      await calendarioService.enviarBilheteria(date);

      setReloadSalas(true);
      enqueueSnackbar('Bilheteria gerada e enviada com sucesso');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Erro ao gerar e enviar bilheteria';
      handleError(error, msg);
    } finally {
      setLoadingConfirmar(false);
      setEmptyDateModal({ open: false, date: null });
    }
  };

  return {
    emptyDateModal,
    loadingConfirmar,
    setEmptyDateModal,
    handleEnviarBilheteria,
  };
}
