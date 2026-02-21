'use client';

import { IConfiguracaoEntradaCreateUpdate } from '@/models';
import { pages, useRouter } from '@/routes';
import { configuracaoEntradaService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { ConfiguracaoEntradaEditTabs } from './configuracao-entrada-create-edit-tabs';

interface Props {
  currentData?: IConfiguracaoEntradaCreateUpdate;
}

export function ConfiguracaoEntradaCreateEditForm({ currentData }: Props) {
  const router = useRouter();
  const handleError = useError();

  const { enqueueSnackbar } = useSnackbar();

  const [finalizeForm, setFinalizeForm] = useState<boolean>(false);

  const [values, setValues] = useState<IConfiguracaoEntradaCreateUpdate>(
    {} as IConfiguracaoEntradaCreateUpdate,
  );

  const handleCreate = async (data: IConfiguracaoEntradaCreateUpdate) => {
    configuracaoEntradaService
      .create(data)
      .then(() => {
        enqueueSnackbar('Vínculo criado com sucesso!');
        router.push(pages.dashboard.estoque.mercadoria.configuracaoEntrada.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao criar configuração de entrada!'))
      .finally(() => setFinalizeForm(false));
  };

  const handleUpdate = async (data: IConfiguracaoEntradaCreateUpdate) => {
    configuracaoEntradaService
      .update({ ...data, id: Number(currentData?.id) })
      .then(() => {
        enqueueSnackbar('Configuração de entrada atualizada com sucesso!');
        router.push(pages.dashboard.estoque.mercadoria.configuracaoEntrada.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao atualizar configuração de entrada!'))
      .finally(() => setFinalizeForm(false));
  };

  useEffect(() => {
    if (finalizeForm) {
      currentData ? handleUpdate(values) : handleCreate(values);
    }
  }, [finalizeForm]);

  return (
    <ConfiguracaoEntradaEditTabs
      currentData={currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
    />
  );
}
