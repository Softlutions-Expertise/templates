'use client';

import { useSnackbar } from '@/components';
import { IPainelDigitalCreateEdit } from '@/models';
import { pages, useRouter } from '@/routes';
import { painelDigitalService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { PainelDigitalCreateEditTabs } from './painel-digital-create-edit-tabs';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IPainelDigitalCreateEdit;
}

export function PainelDigitalCreatEditForm({ currentData }: Props) {
  const handleError = useError();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [finalizeForm, setFinalizeForm] = useState<boolean>(false);

  const [values, setValues] = useState<IPainelDigitalCreateEdit>();

  const handleCreate = async (data: IPainelDigitalCreateEdit) => {
    painelDigitalService
      .create(data)
      .then(() => {
        enqueueSnackbar('Criado com sucesso!');
        router.push(pages.dashboard.estabelecimento.painelDigital.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao criar painel digital!'))
      .finally(() => setFinalizeForm(false));
  };

  const handleUpdate = async (data: IPainelDigitalCreateEdit) => {
    painelDigitalService
      .update({ ...data, id: Number(currentData?.id) })
      .then(() => {
        enqueueSnackbar('Atualizado com sucesso!');
        router.push(pages.dashboard.estabelecimento.painelDigital.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao atualizar painel digital!'))
      .finally(() => setFinalizeForm(false));
  };

  const clearingShippingData = (data: any) => {
    return data;
  };

  useEffect(() => {
    if (finalizeForm) {
      const data = clearingShippingData(values);

      !currentData ? handleCreate(data) : handleUpdate(data);
    }
  }, [finalizeForm]);

  return (
    <PainelDigitalCreateEditTabs
      currentData={values || currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
    />
  );
}
