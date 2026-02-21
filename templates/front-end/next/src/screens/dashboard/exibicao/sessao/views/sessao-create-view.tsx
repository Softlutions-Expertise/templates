'use client';

import { Breadcrumbs, Container } from '@/components';

import { pages } from '@/routes';
import { SessaoCreateEditForm } from '../sessao-create-edit-form';

// ----------------------------------------------------------------------

export function SessaoCreateView() {
  return (
    <Container>
      <Breadcrumbs
        heading="Cadastrar Sessão"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Sessão',
            href: pages.dashboard.estoque.mercadoria.configuracaoEntrada.list.path,
          },
          { name: 'Nova Sessão' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SessaoCreateEditForm />
    </Container>
  );
}
