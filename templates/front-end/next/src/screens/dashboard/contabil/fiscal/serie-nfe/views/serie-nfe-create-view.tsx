'use client';

import { Breadcrumbs, Container } from '@/components';

import { pages } from '@/routes';
import { SerieNfeCreateEditForm } from '../serie-nfe-create-edit-form';

// ----------------------------------------------------------------------

export function SerieNfeCreateView() {
  return (
    <Container>
      <Breadcrumbs
        heading="Cadastrar Série Nfe"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Séries Nfe',
            href: pages.dashboard.contabil.fiscal.serieNfe.list.path,
          },
          { name: 'Nova Série Nfe' },
        ]}
      />
      <SerieNfeCreateEditForm />
    </Container>
  );
}
