'use client';

import { Breadcrumbs, Container } from '@/components';

import { pages } from '@/routes';
import { SolicitacaoAjusteCreateEditForm } from '../solicitacao-ajuste-create-edit-form';

// ----------------------------------------------------------------------

export function SolicitacaoAjusteCreateView() {
  return (
    <Container>
      <Breadcrumbs
        heading="Cadastrar Solicitação de Ajuste"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Solicitações de ajuste',
            href: pages.dashboard.estoque.solicitacaoAjuste.list.path,
          },
          { name: 'Nova Solicitação de Ajuste' },
        ]}
      />
      <SolicitacaoAjusteCreateEditForm />
    </Container>
  );
}
