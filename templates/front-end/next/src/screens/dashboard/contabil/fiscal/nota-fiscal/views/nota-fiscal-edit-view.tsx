'use client';

import { Breadcrumbs, Container } from '@/components';
import { INotaFiscalCreateUpdate } from '@/models';
import { pages, useParams, useRouter, useSearchParams } from '@/routes';
import { notaFiscalService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { CopyUrlButton } from '../components/copy-url-button';
import { NotaFiscalCreateEditForm } from '../nota-fiscal-create-edit-form';

// ----------------------------------------------------------------------

export function NotaFiscalEditView() {
  const router = useRouter();
  const handleError = useError();
  const searchParams = useSearchParams();

  const { id } = useParams();

  const [currentData, setCurrentData] = useState<INotaFiscalCreateUpdate>();

  const currentTab = searchParams.get('tab');

  useEffect(() => {
    notaFiscalService
      .findOneById(id as string)
      .then((response) => setCurrentData(response))
      .catch((error) => {
        handleError(error, 'Erro ao atualizar nota fiscal!');
        router.push(pages.dashboard.contabil.fiscal.notaFiscal.list.path);
      });
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Editar Nota Fiscal"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Notas Fiscais',
            href: pages.dashboard.contabil.fiscal.notaFiscal.list.path,
          },
          {
            name: currentData?.id?.toString(),
          },
        ]}
        action={<CopyUrlButton currentTab={currentTab || undefined} />}
      />
      {currentData && <NotaFiscalCreateEditForm currentData={currentData} />}
    </Container>
  );
}
