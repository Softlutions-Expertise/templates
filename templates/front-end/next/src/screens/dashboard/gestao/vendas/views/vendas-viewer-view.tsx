'use client';

import { Breadcrumbs, useSettingsContext } from '@/components';
import { IVendasViewer } from '@/models';
import { VendasService } from '@/services';
import Container from '@mui/material/Container';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';
import { getSessionItem } from '@softlutions/utils';

import { pages } from '@/routes';
import VendasViewerForm from '../vendas-create-edit-form';

// ----------------------------------------------------------------------

export function VendasViewerView() {
  const settings = useSettingsContext();
  const handleErrors = useError();

  const [currentData, setCurrentData] = useState<IVendasViewer>();

  useEffect(() => {
    const id = getSessionItem('id');
    if (id) {
      VendasService.show(id)
        .then((response) => setCurrentData(response))
        .catch((error) => handleErrors(error, 'Erro ao consultar venda'));
    }
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Breadcrumbs
        heading="Visualizar venda"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Vendas',
            href: pages.dashboard.gestao.vendas.list.path,
          },
          { name: currentData?.id?.toString() },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentData && <VendasViewerForm currentData={currentData} />}
    </Container>
  );
}
