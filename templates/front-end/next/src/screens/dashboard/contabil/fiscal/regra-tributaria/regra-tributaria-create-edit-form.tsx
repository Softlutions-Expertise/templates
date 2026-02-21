'use client';

import { IRegraTributariaCreateUpdate } from '@/models';
import { pages, useRouter } from '@/routes';
import { regraTributariaService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { RegraTributariaEditTabs } from './regra-tributaria-create-edit-tabs';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IRegraTributariaCreateUpdate;
  isView?: boolean;
}

export function RegraTributariaCreateEditForm({ currentData, isView }: Props) {
  const handleError = useError();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [finalizeForm, setFinalizeForm] = useState<boolean>(false);

  const [values, setValues] = useState<IRegraTributariaCreateUpdate>();

  const handleCreate = async (data: IRegraTributariaCreateUpdate) => {
    regraTributariaService
      .create(data)
      .then(() => {
        enqueueSnackbar('Criado com sucesso!');
        router.push(pages.dashboard.contabil.fiscal.regraTributaria.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao criar regra tributária!'))
      .finally(() => setFinalizeForm(false));
  };

  const handleUpdate = async (data: IRegraTributariaCreateUpdate) => {
    regraTributariaService
      .update(Number(currentData?.id), { ...data, id: Number(currentData?.id) })
      .then(() => {
        enqueueSnackbar('Atualizado com sucesso!');
        router.push(pages.dashboard.contabil.fiscal.regraTributaria.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao atualizar regra tributária!'))
      .finally(() => setFinalizeForm(false));
  };

  const clearingShippingData = (data: IRegraTributariaCreateUpdate) => {
    return data;
  };

  useEffect(() => {
    if (finalizeForm && values) {
      const data = clearingShippingData(values);
      !currentData ? handleCreate(data) : handleUpdate(data);
    }
  }, [finalizeForm, values, currentData]);

  return (
    <RegraTributariaEditTabs
      currentData={values || currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
      isView={isView}
    />
  );
}
