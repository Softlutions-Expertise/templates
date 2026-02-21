'use client';

import { IInutilizacaoCreateUpdate } from '@/models';
import { pages, useRouter } from '@/routes';
import { inutilizacaoService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { InutilizacaoCreateTabs } from './inutilizacao-create-tabs';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IInutilizacaoCreateUpdate;
  isView?: boolean;
}

export function InutilizacaoCreateEditForm({ currentData, isView }: Props) {
  const handleError = useError();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [finalizeForm, setFinalizeForm] = useState<boolean>(false);
  const [values, setValues] = useState<IInutilizacaoCreateUpdate>();

  const handleCreate = async (data: IInutilizacaoCreateUpdate) => {
    inutilizacaoService
      .create(data)
      .then(() => {
        enqueueSnackbar('Inutilização criada com sucesso!');
        router.push(pages.dashboard.contabil.fiscal.inutilizacao.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao criar inutilização!'))
      .finally(() => setFinalizeForm(false));
  };

  useEffect(() => {
    if (finalizeForm && values) {
      handleCreate(values);
    }
  }, [finalizeForm, values]);

  return (
    <InutilizacaoCreateTabs
      currentData={values || currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
      isView={isView}
    />
  );
}
