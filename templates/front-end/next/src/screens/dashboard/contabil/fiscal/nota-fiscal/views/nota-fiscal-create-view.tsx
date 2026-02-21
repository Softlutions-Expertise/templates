'use client';

import { Breadcrumbs, Container } from '@/components';
import { pages, useSearchParams } from '@/routes';

import { CopyUrlButton } from '../components/copy-url-button';
import { NotaFiscalCreateEditForm } from '../nota-fiscal-create-edit-form';

// ----------------------------------------------------------------------

export function NotaFiscalCreateView() {
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab');

  return (
    <Container>
      <Breadcrumbs
        heading="Cadastrar Nota Fiscal"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Notas Fiscais',
            href: pages.dashboard.contabil.fiscal.notaFiscal.list.path,
          },
          { name: 'Nova nota' },
        ]}
        action={<CopyUrlButton currentTab={currentTab || undefined} />}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NotaFiscalCreateEditForm />
    </Container>
  );
}
