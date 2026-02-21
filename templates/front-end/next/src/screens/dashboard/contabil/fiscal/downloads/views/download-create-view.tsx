'use client';

import { Breadcrumbs, Container } from '@/components';

import { pages } from '@/routes';
import { DownloadCreateEditForm } from '../download-create-edit-form';

// ----------------------------------------------------------------------

export function DownloadCreateView() {
  return (
    <Container>
      <Breadcrumbs
        heading="Downloads de documentos fiscais"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Downloads',
          },
        ]}
      />

      <DownloadCreateEditForm />
    </Container>
  );
}