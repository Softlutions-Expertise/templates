'use client';

import { Breadcrumbs, Container } from '@/components';
import { IPainelDigitalCreateEdit } from '@/models';
import { pages, useParams, useRouter } from '@/routes';
import { painelDigitalService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { PainelDigitalCreatEditForm } from '../painel-digital-create-edit-form';

// ----------------------------------------------------------------------

export function PainelDigitalEditView() {
  const router = useRouter();
  const handleError = useError();

  const { id } = useParams();

  const [currentData, setcurrentData] = useState<IPainelDigitalCreateEdit>();

  useEffect(() => {
    painelDigitalService
      .findOneById(id as string)
      .then((response) => setcurrentData(response))
      .catch((error) => {
        handleError(error, 'Erro ao consultar painel digital');
        router.push(pages.dashboard.estabelecimento.painelDigital.list.path);
      });
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Editar Painel Digital"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Paineis Digitais',
            href: pages.dashboard.estabelecimento.painelDigital.list.path,
          },
          { name: currentData?.nome },
        ]}
      />
      {currentData && <PainelDigitalCreatEditForm currentData={currentData} />}
    </Container>
  );
}
