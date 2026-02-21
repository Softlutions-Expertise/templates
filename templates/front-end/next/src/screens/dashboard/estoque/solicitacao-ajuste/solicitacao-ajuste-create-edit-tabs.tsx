'use client';

import { Tabs } from '@/components';
import {
  IEstoqueContext,
  ISolicitacaoAjusteCreateUpdate,
  ISolicitacaoAjusteFinalizeForm,
  ISolicitacaoAjusteTabs,
} from '@/models';
import { estoqueService } from '@/services';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { SolicitacaoAJusteActions } from './components';
import { SOLICITACAO_AJUSTE_ENUM } from './enums';
import { solicitacaoAjusteResolver } from './resolver';
import { SolicitacaoAjusteHistoricoList } from './solicitacao-ajuste-form-historico-list';
import { SolicitacaoAjusteFormMercadoria } from './solicitacao-ajuste-form-mercadoria';

// ----------------------------------------------------------------------

interface Props {
  currentData?: ISolicitacaoAjusteCreateUpdate;
  setValues: (value: ISolicitacaoAjusteCreateUpdate) => void;
  finalizeForm: ISolicitacaoAjusteFinalizeForm;
  setFinalizeForm: (value: ISolicitacaoAjusteFinalizeForm) => void;
}

export function SolicitacaoAjusteEditTabs({
  currentData,
  setValues,
  finalizeForm,
  setFinalizeForm,
}: Props) {
  const handleError = useError();

  const [context, setContext] = useState<IEstoqueContext>({} as IEstoqueContext);

  const [currentTab, setCurrentTab] = useState<ISolicitacaoAjusteTabs>('mercadoria');

  const methods = solicitacaoAjusteResolver(currentData);

  const onSubmit = (data: ISolicitacaoAjusteCreateUpdate) => {
    setValues(data);
    setFinalizeForm({ ...finalizeForm, load: true });
  };

  useEffect(() => {
    estoqueService
      .context()
      .then((response) => setContext(response))
      .catch((error) => handleError(error, 'Erro ao consultar contexto'));
  }, []);

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Tabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabs={SOLICITACAO_AJUSTE_ENUM.FORM_TABS}
        />

        {currentTab === 'mercadoria' && <SolicitacaoAjusteFormMercadoria context={context} />}

        {currentTab === 'historico' && <SolicitacaoAjusteHistoricoList />}

        <SolicitacaoAJusteActions
          finalizeForm={finalizeForm}
          setFinalizeForm={setFinalizeForm}
          setCurrentTab={setCurrentTab}
        />
      </Grid>
    </RHFFormProvider>
  );
}
