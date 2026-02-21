'use client';

import { ISerieNfeCreateUpdate } from '@/models';
import { pages, useRouter } from '@/routes';
import { serieService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { SerieNfeEditTabs } from './serie-nfe-create-edit-tabs';

// ----------------------------------------------------------------------

interface Props {
  currentData?: ISerieNfeCreateUpdate;
}

export function SerieNfeCreateEditForm({ currentData }: Props) {
  const handleError = useError();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [finalizeForm, setFinalizeForm] = useState<boolean>(false);

  const [values, setValues] = useState<ISerieNfeCreateUpdate>({} as ISerieNfeCreateUpdate);

  const handleCreate = async (data: ISerieNfeCreateUpdate) => {
    serieService
      .create(data)
      .then(() => {
        enqueueSnackbar('Criado com sucesso!');
        router.push(pages.dashboard.contabil.fiscal.serieNfe.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao criar série NFe!'))
      .finally(() => setFinalizeForm(false));
  };

  const handleUpdate = async (data: ISerieNfeCreateUpdate) => {
    if (!data.ambiente || !data.modelo || !data.serie) {
      handleError(
        new Error('Ambiente, Modelo e Série são obrigatórios para atualização!'),
        'Erro na atualização!',
      );
      setFinalizeForm(false);
      return;
    }
    serieService
      .update(data)
      .then(() => {
        enqueueSnackbar('Atualizado com sucesso!');
        router.push(pages.dashboard.contabil.fiscal.serieNfe.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao atualizar série NFe!'))
      .finally(() => setFinalizeForm(false));
  };

  const clearingShippingData = (data: ISerieNfeCreateUpdate) => {
    return data;
  };

  useEffect(() => {
    if (finalizeForm) {
      const data = clearingShippingData(values);
      !currentData ? handleCreate(data) : handleUpdate(data);
    }
  }, [finalizeForm]);

  return (
    <SerieNfeEditTabs
      currentData={currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
    />
  );
}
