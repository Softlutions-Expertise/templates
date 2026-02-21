'use client';

import { ISala } from '@/models';
import { pages, useParams, useRouter } from '@/routes';
import { salaService } from '@/services/dashboard/exibicao/sala/sala-service';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { SalaCreateEditForm } from '../sala-create-edit-form';

// ----------------------------------------------------------------------

export function SalaEditView() {
  const router = useRouter();
  const handleError = useError();

  const { id } = useParams();

  const [currentData, setCurrentData] = useState<ISala>();

  useEffect(() => {
    salaService
      .show(id as string)
      .then((response) => {
        setCurrentData({ ...response, id: Number(id) });
      })
      .catch((error) => {
        handleError(error, 'Erro ao consultar sala');
        router.push(pages.dashboard.exibicao.sala.list.path);
      });
  }, []);

  if (!currentData) return null;

  return <SalaCreateEditForm currentData={currentData} />;
}
