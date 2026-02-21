'use client';

import { Breadcrumbs, Container } from '@/components';
import { pages } from '@/routes';

import { InutilizacaoCreateEditForm } from '../inutilizacao-create-edit-form';

// ----------------------------------------------------------------------

export function InutilizacaoCreateView() {
  return (
    <Container>
      <Breadcrumbs
        heading="Nova Inutilização"
        links={[
          { name: 'Painel', href: pages.dashboard.root.path },
          {
            name: 'Inutilização',
            href: pages.dashboard.contabil.fiscal.inutilizacao.list.path,
          },
          { name: 'Nova' },
        ]}
      />

      <InutilizacaoCreateEditForm />
    </Container>
  );
}
