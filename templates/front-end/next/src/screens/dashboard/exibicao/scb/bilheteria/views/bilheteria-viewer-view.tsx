'use client';

import { Breadcrumbs } from '@/components';
import { IBilheteria } from '@/models';
import { pages, useParams, useRouter } from '@/routes';
import { bilheteriaService } from '@/services';
import Grid from '@mui/material/Unstable_Grid2';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { Tabs } from '@/components/tabs';

import { BilheteriaViewerMensagem } from '../bilheteria-viewer-mensagem';
import { BilheteriaViewerSessoes } from '../bilheteria-viewer-sessoes';
import { BILHETERIA_ENUM } from '../enums';

// ----------------------------------------------------------------------

type TabKey = 'mensagens' | 'sessoes';

export function BilheteriaViewerView() {
  const handleError = useError();
  const router = useRouter();
  const { id } = useParams();

  const [currentData, setCurrentData] = useState<IBilheteria>();
  const [currentTab, setCurrentTab] = useState<TabKey>('mensagens');

  useEffect(() => {
    bilheteriaService
      .findOneById(id as any)
      .then((response) => setCurrentData(response))
      .catch((error) => {
        handleError(error, 'Erro ao consultar bilheteria');
        router.push(pages.dashboard.exibicao.scb.bilheteria.list.path);
      });
  }, []);

  const tabs = [
    { value: 'mensagens', label: 'Mensagens' },
    { value: 'sessoes', label: 'Sessões' },
  ];

  return (
    <>
      <Breadcrumbs
        heading="Visualização da Bilheteria"
        links={[
          { name: 'Painel', href: pages.dashboard.root.path },
          { name: 'Bilheteria', href: pages.dashboard.exibicao.scb.bilheteria.list.path },
          { name: 'Visualização' },
        ]}
        actionRouter={{
          type: 'list',
          route: pages.dashboard.exibicao.scb.bilheteria.list.path,
          label: 'Listar Bilheteiras',
        }}
      />

      <Grid container spacing={3}>
        <Tabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabs={BILHETERIA_ENUM.FORM_TABS}
        />

        {currentTab === 'mensagens' && currentData && (
          <BilheteriaViewerMensagem currentData={currentData} />
        )}

        {currentTab === 'sessoes' && currentData && (
          <BilheteriaViewerSessoes currentData={currentData} />
        )}
      </Grid>
    </>
  );
}
