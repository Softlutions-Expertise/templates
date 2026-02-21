'use client';

import { ISolicitacaoAjusteCreateUpdate, ISolicitacaoAjusteFinalizeForm } from '@/models';
import { pages, useRouter } from '@/routes';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { solicitacaoAjusteService } from '@/services/dashboard/estoque';

import { SOLICITACAO_AJUSTE_ENUM } from './enums';
import { SolicitacaoAjusteEditTabs } from './solicitacao-ajuste-create-edit-tabs';

// ----------------------------------------------------------------------

interface Props {
  currentData?: ISolicitacaoAjusteCreateUpdate;
}

export function SolicitacaoAjusteCreateEditForm({ currentData }: Props) {
  const handleError = useError();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [finalizeForm, setFinalizeForm] = useState<ISolicitacaoAjusteFinalizeForm>(
    SOLICITACAO_AJUSTE_ENUM.DEFAULT_FINALIZE_FORM,
  );

  const [values, setValues] = useState<ISolicitacaoAjusteCreateUpdate>(
    {} as ISolicitacaoAjusteCreateUpdate,
  );

  const handleCreate = async (data: ISolicitacaoAjusteCreateUpdate) => {
    solicitacaoAjusteService
      .create(data)
      .then((response) => {
        enqueueSnackbar('Criado com sucesso!');
        router.push(pages.dashboard.estoque.solicitacaoAjuste.edit.path(response?.id));
      })
      .catch((error) => handleError(error, 'Erro ao criar solicitação de ajuste!'))
      .finally(() => setFinalizeForm(SOLICITACAO_AJUSTE_ENUM.DEFAULT_FINALIZE_FORM));
  };

  const handleUpdate = async (data: ISolicitacaoAjusteCreateUpdate) => {
    solicitacaoAjusteService
      .update({ ...data, id: Number(currentData?.id) })
      .then(() => {
        enqueueSnackbar('Atualizado com sucesso!');
        router.push(pages.dashboard.estoque.solicitacaoAjuste.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao atualizar solicitação de ajuste!'))
      .finally(() => setFinalizeForm(SOLICITACAO_AJUSTE_ENUM.DEFAULT_FINALIZE_FORM));
  };

  const handleEnviar = async (id: string) => {
    solicitacaoAjusteService
      .enviar(id)
      .then(() => {
        enqueueSnackbar('Enviado com sucesso!');
        router.push(pages.dashboard.estoque.solicitacaoAjuste.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao enviar solicitação de ajuste!'))
      .finally(() => setFinalizeForm(SOLICITACAO_AJUSTE_ENUM.DEFAULT_FINALIZE_FORM));
  };

  const clearingShippingData = (data: ISolicitacaoAjusteCreateUpdate) => {
    return data;
  };

  useEffect(() => {
    if (finalizeForm.load) {
      const data = clearingShippingData(values);
      switch (finalizeForm.type) {
        case 'salvar':
          !currentData ? handleCreate(data) : handleUpdate(data);

          break;
        case 'enviar':
          handleEnviar(currentData?.id?.toString() || '');
          break;
      }
    }
  }, [finalizeForm.load]);

  return (
    <SolicitacaoAjusteEditTabs
      currentData={currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
    />
  );
}
