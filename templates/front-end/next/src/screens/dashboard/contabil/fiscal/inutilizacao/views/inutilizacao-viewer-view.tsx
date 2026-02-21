'use client';

import { Breadcrumbs, Container } from '@/components';
import { IInutilizacaoCreateUpdate } from '@/models';
import { pages, useRouter } from '@/routes';
import { inutilizacaoService } from '@/services';
import { useError } from '@softlutions/hooks';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { InutilizacaoCreateEditForm } from '../inutilizacao-create-edit-form';

// ----------------------------------------------------------------------

export function InutilizacaoViewerView() {
  const router = useRouter();
  const handleError = useError();
  const { id } = useParams();

  const [currentData, setCurrentData] = useState<IInutilizacaoCreateUpdate>();

  useEffect(() => {
    inutilizacaoService
      .findOneById(Number(id))
      .then((response) => {
        setCurrentData({
          modelo: response.modelo as any,
          serie: response.serie,
          justificativa: response.justificativa,
          sequencias: [
            {
              numeracaoInicial: parseInt(response.numeracaoInicial),
              numeracaoFinal: response.numeracaoFinal ? parseInt(response.numeracaoFinal) : null,
            },
          ],
          id: response.id,
          dataHora: response.dataHora,
          status: response.status,
          ambiente: response.ambiente,
          protocolo: response.protocolo,
          detalhes: response.detalhes,
          autorizado: response.autorizado,
        });
      })
      .catch((error) => {
        handleError(error, 'Erro ao consultar inutilização');
        router.push(pages.dashboard.contabil.fiscal.inutilizacao.list.path);
      });
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Visualizar Inutilização"
        links={[
          { name: 'Painel', href: pages.dashboard.root.path },
          {
            name: 'Inutilização',
            href: pages.dashboard.contabil.fiscal.inutilizacao.list.path,
          },
          { name: currentData ? `#${id}` : 'Carregando...' },
        ]}
      />

      {currentData && <InutilizacaoCreateEditForm currentData={currentData} isView />}
    </Container>
  );
}
