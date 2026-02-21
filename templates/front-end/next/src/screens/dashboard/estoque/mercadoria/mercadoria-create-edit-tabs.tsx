'use client';

import { FormActions, Tabs } from '@/components';
import { IMercadoriaTabs, IMercadoriaUpdate } from '@/models';
import { pages } from '@/routes';
import { estoqueService } from '@/services';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { useEffect, useState } from 'react';

import { MERCADORIA_ENUM } from './enums';
import { MercadoriaFormComponente } from './mercadoria-form-componente';
import { MercadoriaFormInformacoesGerais } from './mercadoria-form-informacoes-gerais';
import { mercadoriaResolver } from './resolver';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IMercadoriaUpdate;
  setValues: (value: IMercadoriaUpdate) => void;
  finalizeForm: boolean;
  setFinalizeForm: (value: boolean) => void;
}

export function MercadoriaEditTabs({
  currentData,
  setValues,
  finalizeForm,
  setFinalizeForm,
}: Props) {
  const [currentTab, setCurrentTab] = useState<IMercadoriaTabs>('informacoesGerais');

  const [context, setContext] = useState<any>({} as any);

  const methods = mercadoriaResolver(currentData);

  const onSubmit = async (data: IMercadoriaUpdate) => {
    setValues(data);
    setFinalizeForm(true);
  };

  useEffect(() => {
    estoqueService.context().then((response) => setContext(response));
  }, []);

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Tabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabs={MERCADORIA_ENUM.FORM_TABS}
        />

        {currentTab === 'informacoesGerais' && (
          <MercadoriaFormInformacoesGerais context={context} />
        )}

        {currentTab === 'componente' && <MercadoriaFormComponente context={context} />}

        <FormActions
          tabs={MERCADORIA_ENUM.FORM_TABS}
          currentTab={currentTab}
          setCurrentTab={(tab) => setCurrentTab(tab as IMercadoriaTabs)}
          finalizeForm={finalizeForm}
          listPath={pages.dashboard.estoque.mercadoria.list.path}
          isEditMode={!!currentData}
        />
      </Grid>
    </RHFFormProvider>
  );
}
