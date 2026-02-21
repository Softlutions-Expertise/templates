'use client';

import { useEffect, useState } from 'react';

import { FormActions, Tabs } from '@/components';
import { IFiscalContext, ISerieNfeCreateUpdate, TSerieNfeTabs } from '@/models';
import { pages } from '@/routes';
import { fiscalService } from '@/services';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';

import { SERIE_NFE_ENUM } from './enums';
import { SerieNfeResolver } from './resolver';
import { SerieNfeFormInformacoesGerais } from './serie-nfe-form-informacoes-gerais';

// ----------------------------------------------------------------------

interface Props {
  currentData?: ISerieNfeCreateUpdate;
  setValues: (value: ISerieNfeCreateUpdate) => void;
  finalizeForm: boolean;
  setFinalizeForm: (value: boolean) => void;
}

export function SerieNfeEditTabs({ currentData, setValues, finalizeForm, setFinalizeForm }: Props) {
  const [context, setContext] = useState<IFiscalContext>({} as IFiscalContext);

  const [currentTab, setCurrentTab] = useState<TSerieNfeTabs>('informacoesGerais');

  const methods = SerieNfeResolver(currentData);

  const onSubmit = (data: ISerieNfeCreateUpdate) => {
    setValues(data);
    setFinalizeForm(true);
  };

  useEffect(() => {
    fiscalService.context().then((response) => setContext(response));
  }, []);

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Tabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabs={SERIE_NFE_ENUM.FORM_TABS}
        />

        {currentTab === 'informacoesGerais' && (
          <SerieNfeFormInformacoesGerais context={context} isEdit={!!currentData} />
        )}

        <FormActions
          tabs={SERIE_NFE_ENUM.FORM_TABS}
          currentTab={currentTab}
          setCurrentTab={(tab) => setCurrentTab(tab as TSerieNfeTabs)}
          finalizeForm={finalizeForm}
          listPath={pages.dashboard.contabil.fiscal.serieNfe.list.path}
          isEditMode={!!currentData}
        />
      </Grid>
    </RHFFormProvider>
  );
}
