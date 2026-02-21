'use client';

import { Breadcrumbs, Container } from '@/components';
import { ISerieNfeCreateUpdate } from '@/models';
import { pages, useRouter, useSearchParams } from '@/routes';
import { serieService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { SerieNfeCreateEditForm } from '../serie-nfe-create-edit-form';

// ----------------------------------------------------------------------

export function SerieNfeEditView() {
  const router = useRouter();
  const handleError = useError();
  const searchParams = useSearchParams();

  const ambiente = searchParams.get('ambiente');
  const modelo = searchParams.get('modelo');
  const serie = searchParams.get('serie');

  const [currentData, setCurrentData] = useState<ISerieNfeCreateUpdate>();

  useEffect(() => {
    if (ambiente && modelo && serie) {
      serieService
        .findOneById(ambiente, modelo, Number(serie))
        .then((response) => setCurrentData(response))
        .catch((error) => {
          handleError(error, 'Erro ao consultar série NFe');
          router.push(pages.dashboard.contabil.fiscal.serieNfe.list.path);
        });
    }
  }, [ambiente, modelo, serie]);

  return (
    <Container>
      <Breadcrumbs
        heading="Editar Série NFe"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Séries NFe',
            href: pages.dashboard.contabil.fiscal.serieNfe.list.path,
          },
        ]}
      />

      {currentData && <SerieNfeCreateEditForm currentData={currentData} />}
    </Container>
  );
}
