'use client';

import { Tabs } from '@/components';
import { IConfiguracaoEntradaCreateUpdate, IConfiguracaoEntradaTabs } from '@/models';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { useState } from 'react';

import { ConfiguracaoEntradaActions } from './components';
import { ConfiguracaoEntradaFormInformacoesGerais } from './configuracao-entrada-form-informacoes-gerais';
import { CONFIGURACAO_ENTRADA_ENUM } from './enums';
import { ConfiguracaoEntradaResolver } from './resolver';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IConfiguracaoEntradaCreateUpdate;
  setValues: (value: IConfiguracaoEntradaCreateUpdate) => void;
  finalizeForm: boolean;
  setFinalizeForm: (value: boolean) => void;
}

export function ConfiguracaoEntradaEditTabs({
  currentData,
  setValues,
  finalizeForm,
  setFinalizeForm,
}: Props) {
  const [currentTab, setCurrentTab] = useState<IConfiguracaoEntradaTabs>('informacoesGerais');

  const methods = ConfiguracaoEntradaResolver(currentData);

  const onSubmit = async (data: IConfiguracaoEntradaCreateUpdate) => {
    const idConfiguracaoEntrada =
      typeof data.fornecedor === 'number' ? data.fornecedor : data.fornecedor?.id;
    const idMercadoriaLocal =
      typeof data.mercadoriaLocal === 'number' ? data.mercadoriaLocal : data.mercadoriaLocal?.id;

    const formattedData: IConfiguracaoEntradaCreateUpdate = {
      ...data,
      fornecedor: idConfiguracaoEntrada,
      mercadoriaLocal: idMercadoriaLocal,
    };
    setValues(formattedData);
    setFinalizeForm(true);
  };

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Tabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabs={CONFIGURACAO_ENTRADA_ENUM.FORM_TABS}
        />

        {currentTab === 'informacoesGerais' && (
          <ConfiguracaoEntradaFormInformacoesGerais currentData={currentData} />
        )}

        <ConfiguracaoEntradaActions finalizeForm={finalizeForm} setCurrentTab={setCurrentTab} />
      </Grid>
    </RHFFormProvider>
  );
}
