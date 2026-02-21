'use client';

import { FormActions, Tabs } from '@/components';
import { IFiscalContext, IParametroUpdate, TParametroTabs } from '@/models';
import { fiscalService } from '@/services';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { useEffect, useState } from 'react';

import { PARAMETRO_ENUM } from './enums';
import { ParametroFormCertificadoDigital } from './parametro-form-certificado-digital';
import { ParametroFormInformacoesGerais } from './parametro-form-informacoes-gerais';
import { parametroResolver } from './resolver';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IParametroUpdate;
  setValues: (value: IParametroUpdate) => void;
  finalizeForm: boolean;
  setFinalizeForm: (value: boolean) => void;
}

export function ParametroEditTabs({
  currentData,
  setValues,
  finalizeForm,
  setFinalizeForm,
}: Props) {
  const [context, setContext] = useState<IFiscalContext>({} as IFiscalContext);

  const [currentTab, setCurrentTab] = useState<TParametroTabs>('informacoesGerais');

  const methods = parametroResolver(currentData);

  const onSubmit = async (data: IParametroUpdate) => {
    setValues(data);
    setFinalizeForm(true);
  };

  useEffect(() => {
    fiscalService.context().then((response) => setContext(response));
  }, []);

  methods.formState.errors;

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Tabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabs={PARAMETRO_ENUM.FORM_TABS}
        />

        {currentTab === 'informacoesGerais' && <ParametroFormInformacoesGerais context={context} />}

        {currentTab === 'certificadoDigital' && <ParametroFormCertificadoDigital />}

        <FormActions
          tabs={PARAMETRO_ENUM.FORM_TABS}
          currentTab={currentTab}
          setCurrentTab={(tab) => setCurrentTab(tab as TParametroTabs)}
          finalizeForm={finalizeForm}
          listPath=""
          showBackButton={false}
          isEditMode={true}
        />
      </Grid>
    </RHFFormProvider>
  );
}
