'use client';

import { useEffect, useState } from 'react';

import { FormActions, Tabs } from '@/components';
import { ISessaoEdit, ISessaoTabs } from '@/models';
import { pages } from '@/routes';
import { sessaoService } from '@/services';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { fDate } from '@softlutions/utils';

import { SESSAO_ENUM } from './enums';
import { SessaoResolver, informacoesGeraisValidationShema, sessaoEditValidationShema } from './resolver';
import { SessaoFormInformacoesGerais } from './sessao-form-informacoes-gerais';
import { SessaoEditInformacoesGerais } from './components/sessao-edit-informacoes-gerais';

// ----------------------------------------------------------------------

interface Props {
  currentData?: ISessaoEdit;
  setValues: (value: any) => void;
  finalizeForm: boolean;
  setFinalizeForm: (value: boolean) => void;
}

export function SessaoEditTabs({
  currentData,
  setValues,
  finalizeForm,
  setFinalizeForm,
}: Props) {
  const [context, setContext] = useState<any>({} as any);
  const [currentTab, setCurrentTab] = useState<ISessaoTabs>('informacoesGerais');

  const methods = SessaoResolver(currentData);

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      dataInicio: data.dataInicio ? fDate('yyyy-MM-dd', data.dataInicio) : undefined,
      dataFim: data.dataFim ? fDate('yyyy-MM-dd', data.dataFim) : undefined,
      data: data.data ? fDate('yyyy-MM-dd', data.data) : undefined,
    };
    
    setValues(formattedData);
    setFinalizeForm(true);
  };

  useEffect(() => {
    sessaoService.context().then((response) => setContext(response));
  }, []);

  return (
    <RHFFormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Tabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabs={SESSAO_ENUM.FORM_TABS}
        />

        {currentTab === 'informacoesGerais' && (
          currentData ? (
            <SessaoEditInformacoesGerais context={context} />
          ) : (
            <SessaoFormInformacoesGerais context={context} currentData={currentData} />
          )
        )}

        <FormActions
          tabs={SESSAO_ENUM.FORM_TABS}
          currentTab={currentTab}
          setCurrentTab={(tab) => setCurrentTab(tab as ISessaoTabs)}
          finalizeForm={finalizeForm}
          listPath={pages.dashboard.exibicao.sessao.list.path}
          isEditMode={!!currentData}
          tabSchemas={[{ 
            name: 'informacoesGerais', 
            keys: currentData ? sessaoEditValidationShema : informacoesGeraisValidationShema 
          }]}
        />
      </Grid>
    </RHFFormProvider>
  );
}
