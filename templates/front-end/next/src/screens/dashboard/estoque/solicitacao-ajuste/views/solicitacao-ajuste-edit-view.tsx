'use client';

import { Breadcrumbs, Container } from '@/components';
import { ISolicitacaoAjusteCreateUpdate } from '@/models';
import { pages, useParams, useRouter } from '@/routes';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { solicitacaoAjusteService } from '@/services/dashboard/estoque';

import { SolicitacaoAjusteCreateEditForm } from '../solicitacao-ajuste-create-edit-form';

// ----------------------------------------------------------------------

export function SolicitacaoAjusteEditView() {
  const router = useRouter();
  const handleError = useError();

  const { id } = useParams();

  const [currentData, setcurrentData] = useState<ISolicitacaoAjusteCreateUpdate>();

  useEffect(() => {
    solicitacaoAjusteService
      .findOneById(id as string)
      .then((response) => setcurrentData(response))
      .catch((error) => {
        handleError(error, 'Erro ao consultar solicitação de ajuste');
        router.push(pages.dashboard.estoque.solicitacaoAjuste.list.path);
      });
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Editar Solicitação de Ajuste"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Solicitações de ajuste',
            href: pages.dashboard.estoque.solicitacaoAjuste.list.path,
          },
          { name: currentData?.id?.toString() },
        ]}
      />
      {currentData && <SolicitacaoAjusteCreateEditForm currentData={currentData} />}
    </Container>
  );
}
