import { useEffect } from 'react';
import { TParametroTabs } from '@/models';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { findTabWithError } from '@softlutions/utils';
import { useFormContext } from 'react-hook-form';

import { certificadoDigitalValidationShema, informacoesGeraisValidationShema } from '../resolver';

// ----------------------------------------------------------------------

interface Props {
  finalizeForm: boolean;
  setCurrentTab: (value: TParametroTabs) => void;
}

export function ParametroActions({ finalizeForm, setCurrentTab }: Props) {
  const { formState } = useFormContext();

  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      const tabSchemas = [
        { name: 'informacoesGerais', keys: informacoesGeraisValidationShema },
        { name: 'certificadoDigital', keys: certificadoDigitalValidationShema },
      ];

      findTabWithError<TParametroTabs>({ tabSchemas, formState, setCurrentTab });
    }
  }, [formState.errors]);

  return (
    <Grid xs={12} mt={-3}>
      <Stack
        alignItems="flex-end"
        flexDirection="row"
        justifyContent="flex-end"
        sx={{ mt: 3, marginLeft: 'auto' }}
      >
        <Stack direction="row" spacing={2}>
          <LoadingButton type="submit" variant="contained" loading={finalizeForm}>
            Salvar Alterações
          </LoadingButton>
        </Stack>
      </Stack>
    </Grid>
  );
}
