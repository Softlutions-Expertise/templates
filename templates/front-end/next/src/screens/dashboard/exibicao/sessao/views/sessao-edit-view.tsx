'use client';

import { Breadcrumbs, Container } from '@/components';
import { ISessaoEdit } from '@/models';
import { pages, useParams, useRouter } from '@/routes';
import { sessaoService } from '@/services';
import { useError } from '@softlutions/hooks';

import { useEffect, useState } from 'react';

import { SessaoCreateEditForm } from '../sessao-create-edit-form';

// ----------------------------------------------------------------------

export function SessaoEditView() {
  const router = useRouter();
  const handleError = useError();

  const { id } = useParams();

  const [currentData, setcurrentData] = useState<ISessaoEdit>();

  useEffect(() => {
    sessaoService
      .show(id as string)
      .then((response) => {
        setcurrentData({ ...response, id: Number(id) });
      })
      .catch((error) => {
        handleError(error, 'Erro ao consultar sessão');
        router.push(pages.dashboard.exibicao.sessao.list.path);
      });
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Editar Sessão"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Sessão',
            href: pages.dashboard.exibicao.sessao.list.path,
          },
          {
            name: 'Editar',
          },
        ]}
      />
      {currentData && <SessaoCreateEditForm currentData={currentData} />}
    </Container>
  );
}
