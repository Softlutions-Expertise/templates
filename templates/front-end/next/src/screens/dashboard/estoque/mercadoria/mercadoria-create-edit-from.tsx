'use client';

import { IMercadoriaUpdate } from '@/models';
import { pages, useRouter } from '@/routes';
import { mercadoriaService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { MercadoriaEditTabs } from './mercadoria-create-edit-tabs';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IMercadoriaUpdate;
}

export function MercadoriaEditForm({ currentData }: Props) {
  const router = useRouter();
  const handleError = useError();

  const { enqueueSnackbar } = useSnackbar();

  const [finalizeForm, setFinalizeForm] = useState<boolean>(false);

  const [values, setValues] = useState<IMercadoriaUpdate>({} as IMercadoriaUpdate);

  const handleUpdate = async (data: IMercadoriaUpdate) => {
    const { id, ...updateData } = data;
    mercadoriaService
      .update({ id: Number(currentData?.id), ...updateData })
      .then(() => {
        enqueueSnackbar('Atualizado com sucesso!');
        router.push(pages.dashboard.estoque.mercadoria.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao atualizar mercadoria!'))
      .finally(() => setFinalizeForm(false));
  };

  useEffect(() => {
    if (finalizeForm) handleUpdate(values);
  }, [finalizeForm]);

  return (
    <MercadoriaEditTabs
      currentData={currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
    />
  );
}
