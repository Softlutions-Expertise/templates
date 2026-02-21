'use client';

import { Breadcrumbs, Container } from '@/components';

import { pages } from '@/routes';
import { PainelDigitalCreatEditForm } from '../painel-digital-create-edit-form';

// ----------------------------------------------------------------------

export function PainelDigitaCreateView() {
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
          { name: 'Novo Painel' },
        ]}
      />
      <PainelDigitalCreatEditForm />
    </Container>
  );
}