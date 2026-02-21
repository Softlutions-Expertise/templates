'use client';

import { Breadcrumbs, Container } from '@/components';

import { pages } from '@/routes';
import { RegraTributariaCreateEditForm } from '../regra-tributaria-create-edit-form';

// ----------------------------------------------------------------------

export function RegraTributariaCreateView() {
  return (
    <Container>
      <Breadcrumbs
        heading="Cadastrar Regra Tributária"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Regras Tributárias',
            href: pages.dashboard.contabil.fiscal.regraTributaria.list.path,
          },
          { name: 'Nova Regra Tributária' },
        ]}
      />
      <RegraTributariaCreateEditForm />
    </Container>
  );
}
