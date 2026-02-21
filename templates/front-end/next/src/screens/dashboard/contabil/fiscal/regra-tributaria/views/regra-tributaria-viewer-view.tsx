'use client';

import { Breadcrumbs } from '@/components';
import { IRegraTributariaCreateUpdate } from '@/models';
import { pages, useRouter } from '@/routes';
import { regraTributariaService } from '@/services';
import { Container } from '@mui/system';
import { useError } from '@softlutions/hooks';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { RegraTributariaCreateEditForm } from '../regra-tributaria-create-edit-form';

// ----------------------------------------------------------------------

export function RegraTributariaViewerView() {
  const router = useRouter();
  const handleError = useError();

  const { id } = useParams();

  const [currentData, setCurrentData] = useState<IRegraTributariaCreateUpdate>();

  useEffect(() => {
    regraTributariaService
      .findOneById(Number(id))
      .then((response) => setCurrentData({ ...response, id: Number(id) }))
      .catch((error) => {
        handleError(error, 'Erro ao consultar regras tributárias');
        router.push(pages.dashboard.contabil.fiscal.regraTributaria.list.path);
      });
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Visualizar Regra Tributária"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Regra Tributária',
            href: pages.dashboard.contabil.fiscal.regraTributaria.list.path,
          },
          { name: currentData?.descricao },
        ]}
      />

      {currentData && <RegraTributariaCreateEditForm currentData={currentData} isView={true} />}
    </Container>
  );
}
