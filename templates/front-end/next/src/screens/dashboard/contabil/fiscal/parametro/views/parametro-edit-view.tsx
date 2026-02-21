'use client';

import { Breadcrumbs, Container } from '@/components';
import { IParametroUpdate } from '@/models';
import { parametrosService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { pages } from '@/routes';
import { ParametroEditForm } from '../parametro-edit-form';

// ----------------------------------------------------------------------

export function ParametroEditView() {
  const handleError = useError();

  const [currentData, setCurrentData] = useState<IParametroUpdate>();

  useEffect(() => {
    parametrosService
      .findOneById()
      .then((response) => setCurrentData(response))
      .catch((error) => handleError(error, 'Erro ao consultar parametro'));
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Parametros Fiscais"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          { name: 'Editar Parametros' },
        ]}
      />

      {currentData && <ParametroEditForm currentData={currentData} />}
    </Container>
  );
}
