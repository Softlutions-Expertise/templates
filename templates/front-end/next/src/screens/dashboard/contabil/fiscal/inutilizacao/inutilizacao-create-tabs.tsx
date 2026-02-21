
'use client';

import { useEffect, useState } from 'react';
import { FormActions, Tabs } from '@/components';
import { IFiscalContext, IInutilizacaoCreateUpdate, TInutilizacaoTabs } from '@/models';
import { pages } from '@/routes';
import { fiscalService } from '@/services';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';

import { INUTILIZACAO_ENUM } from './enums';
import { inutilizacaoResolver } from './resolver';
import { InutilizacaoFormInformacoes } from './inutilizacao-form-informacoes';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IInutilizacaoCreateUpdate;
  setValues: (value: IInutilizacaoCreateUpdate) => void;
  finalizeForm: boolean;
  setFinalizeForm: (value: boolean) => void;
  isView?: boolean;
}

export function InutilizacaoCreateTabs({
  currentData,
  setValues,
  finalizeForm,
  setFinalizeForm,
  isView,
}: Props) {
  const [context, setContext] = useState<IFiscalContext>({} as IFiscalContext);
  const [currentTab, setCurrentTab] = useState<TInutilizacaoTabs>('informacoes');

  const methods = inutilizacaoResolver(currentData);

  const onSubmit = (data: IInutilizacaoCreateUpdate) => {
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
          tabs={INUTILIZACAO_ENUM.FORM_TABS}
        />

        {currentTab === 'informacoes' && <InutilizacaoFormInformacoes context={context} isView={isView} />}

        {!isView && <FormActions
          tabs={INUTILIZACAO_ENUM.FORM_TABS}
          currentTab={currentTab}
          setCurrentTab={(tab) => setCurrentTab(tab as TInutilizacaoTabs)}
          finalizeForm={finalizeForm}
          listPath={pages.dashboard.contabil.fiscal.inutilizacao.list.path}
          isEditMode={false}
        />}
      </Grid>
    </RHFFormProvider>
  );
}
