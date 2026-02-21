'use client';

import { Breadcrumbs, Container } from '@/components';
import { IConfiguracaoEntradaCreateUpdate } from '@/models';
import { pages, useParams, useRouter } from '@/routes';
import { configuracaoEntradaService } from '@/services';
import { useError } from '@softlutions/hooks';

import { useEffect, useState } from 'react';

import { ConfiguracaoEntradaCreateEditForm } from '../configuracao-entrada-create-edit-form';

// ----------------------------------------------------------------------

export function ConfiguracaoEntradaEditView() {
  const router = useRouter();
  const handleError = useError();

  const { id } = useParams();

  const [currentData, setcurrentData] = useState<IConfiguracaoEntradaCreateUpdate>();

  useEffect(() => {
    configuracaoEntradaService
      .findOneById(id as string)
      .then((response) => {
        setcurrentData({ ...response, id: id as string });
      })
      .catch((error) => {
        handleError(error, 'Erro ao consultar configuração de entrada');
        router.push(pages.dashboard.estoque.mercadoria.configuracaoEntrada.list.path);
      });
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Editar Configuração de Entrada"
        links={[
          {
            name: 'Painel',
            href: pages.dashboard.root.path,
          },
          {
            name: 'Configurar Entrada',
            href: pages.dashboard.estoque.mercadoria.configuracaoEntrada.list.path,
          },
        ]}
      />
      {currentData && <ConfiguracaoEntradaCreateEditForm currentData={currentData} />}
    </Container>
  );
}
