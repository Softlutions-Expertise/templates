'use client';

import { Tabs } from '@/components';
import { IPainelDigitalCreateEdit, TPainelDigitalTabs } from '@/models';
import { pages, useRouter } from '@/routes';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { useState } from 'react';

import { PAINEL_DIGITAL_ENUMS } from './enums';
import { PainelDigitalFormInformacoes } from './painel-digital-form-informacoes';
import { PainelDigitalResolver } from './resolver';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IPainelDigitalCreateEdit;
  setValues: (value: any) => void;
  finalizeForm: boolean;
  setFinalizeForm: (value: boolean) => void;
}

export function PainelDigitalCreateEditTabs({
  currentData,
  setValues,
  finalizeForm,
  setFinalizeForm,
}: Props) {
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<TPainelDigitalTabs>('informacoes');

  const methods = PainelDigitalResolver(currentData);

  const onSubmit = async (data: IPainelDigitalCreateEdit) => {
    setValues(data);
    setFinalizeForm(true);
  };

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Tabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabs={PAINEL_DIGITAL_ENUMS.FORM_TABS}
        />

        {currentTab === 'informacoes' && <PainelDigitalFormInformacoes />}

        <Grid xs={12} mt={-3}>
          <Stack
            alignItems="flex-end"
            flexDirection="row"
            justifyContent="flex-end"
            sx={{ mt: 3, marginLeft: 'auto' }}
            spacing={2}
          >
            <Button
              type="button"
              variant="contained"
              onClick={() => router.push(pages.dashboard.estabelecimento.painelDigital.list.path)}
            >
              Voltar
            </Button>
            <LoadingButton type="submit" variant="contained" loading={finalizeForm}>
              Salvar
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </RHFFormProvider>
  );
}
