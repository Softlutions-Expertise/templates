'use client';

import { Breadcrumbs, Container } from '@/components';
import { IMercadoriaUpdate } from '@/models';
import { pages, useParams, useRouter } from '@/routes';
import { mercadoriaService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { MercadoriaEditForm } from '../mercadoria-create-edit-from';

// ----------------------------------------------------------------------

export function MercadoriaEditView() {
  const handleError = useError();
  const router = useRouter();

  const { id } = useParams();

  const [currentData, setCurrentData] = useState<IMercadoriaUpdate>();

  useEffect(() => {
    mercadoriaService
      .findOneById(id as string)
      .then((response) => setCurrentData(response))
      .catch((error) => {
        handleError(error, 'Erro ao consultar mercadoria');
        router.push(pages.dashboard.estoque.mercadoria.list.path);
      });
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Editar Mercadoria"
        links={[
          { name: 'Painel', href: pages.dashboard.root.path },
          { name: 'Mercadorias', href: pages.dashboard.estoque.mercadoria.list.path },
          { name: currentData?.descricao },
        ]}
      />

      {currentData && <MercadoriaEditForm currentData={currentData} />}
    </Container>
  );
}
