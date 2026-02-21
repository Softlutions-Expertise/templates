'use client';

import { useEffect, useState } from 'react';
import { IParametroUpdate } from '@/models';
import { parametrosService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';

import { ParametroEditTabs } from './parametro-edit-tabs';

// ----------------------------------------------------------------------

interface Props {
  currentData: IParametroUpdate;
}

export function ParametroEditForm({ currentData }: Props) {
  const handleError = useError();

  const { enqueueSnackbar } = useSnackbar();

  const [finalizeForm, setFinalizeForm] = useState<boolean>(false);

  const [values, setValues] = useState<IParametroUpdate>({} as IParametroUpdate);

  const handleUpdate = async (data: IParametroUpdate) => {
    parametrosService
      .update(data)
      .then(() => {
        enqueueSnackbar('Atualizado com sucesso!');
        window.location.reload();
      })
      .catch((error) => handleError(error, 'Erro ao editar parâmetro!'))
      .finally(() => setFinalizeForm(false));
  };

  useEffect(() => {
    if (finalizeForm) handleUpdate(values);
  }, [finalizeForm]);

  return (
    <ParametroEditTabs
      currentData={currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
    />
  );
}
