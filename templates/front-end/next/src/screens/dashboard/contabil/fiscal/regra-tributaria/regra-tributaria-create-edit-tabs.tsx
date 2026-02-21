'use client';

import { IFiscalContext, IRegraTributariaCreateUpdate } from '@/models';
import { fiscalService } from '@/services';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

import { RegraTributariaFormInformacoes } from './regra-tributaria-form-informacoes';
import { RegraTributariaResolver } from './resolver';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IRegraTributariaCreateUpdate;
  setValues: (value: IRegraTributariaCreateUpdate) => void;
  finalizeForm: boolean;
  setFinalizeForm: (value: boolean) => void;
  isView?: boolean;
}

export function RegraTributariaEditTabs({
  currentData,
  setValues,
  finalizeForm,
  setFinalizeForm,
  isView,
}: Props) {
  const handleError = useError();

  const [context, setContext] = useState<IFiscalContext>({} as IFiscalContext);

  const methods = RegraTributariaResolver(currentData);

  const onSubmit = (data: IRegraTributariaCreateUpdate) => {
    setValues(data);
    setFinalizeForm(true);
  };

  useEffect(() => {
    fiscalService.context().then((response) => setContext(response));
  }, []);

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <RegraTributariaFormInformacoes isView={isView} />

        {!isView && (
          <Grid xs={12} mt={-3}>
            <Stack
              alignItems="flex-end"
              flexDirection="row"
              justifyContent="flex-end"
              sx={{ mt: 3, marginLeft: 'auto' }}
            >
              <Stack direction="row" spacing={2}>
                <LoadingButton type="submit" variant="contained" loading={finalizeForm}>
                  Salvar
                </LoadingButton>
              </Stack>
            </Stack>
          </Grid>
        )}
      </Grid>
    </RHFFormProvider>
  );
}
