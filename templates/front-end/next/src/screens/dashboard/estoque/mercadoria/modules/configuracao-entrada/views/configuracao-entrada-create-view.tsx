'use client';

import { Breadcrumbs, Container } from '@/components';

import { pages } from '@/routes';
import { ConfiguracaoEntradaCreateEditForm } from '../configuracao-entrada-create-edit-form';

// ----------------------------------------------------------------------

export function ConfiguracaoEntradaCreateView() {
  return (
    <Container>
      <Breadcrumbs
        heading="Cadastrar Configuração de Entrada"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: ' Configurar Entrada',
            href: pages.dashboard.estoque.mercadoria.configuracaoEntrada.list.path,
          },
          { name: 'Nova Configuração de Entrada' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ConfiguracaoEntradaCreateEditForm />
    </Container>
  );
}
