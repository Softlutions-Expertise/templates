import { IMercadoriaTabs } from '@/models';
import { pages, useRouter } from '@/routes';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { findTabWithError } from '@softlutions/utils';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { informacoesGeraisValidationShema } from '../resolver';

// ----------------------------------------------------------------------

interface Props {
  finalizeForm: boolean;
  setCurrentTab: (value: IMercadoriaTabs) => void;
}

export function MercadoriaActions({ finalizeForm, setCurrentTab }: Props) {
  const router = useRouter();

  const { formState } = useFormContext();

  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      const tabSchemas = [{ name: 'informacoesGerais', keys: informacoesGeraisValidationShema }];

      findTabWithError<IMercadoriaTabs>({ tabSchemas, formState, setCurrentTab });
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
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => router.push(pages.dashboard.estoque.mercadoria.list.path)}
          >
            Voltar
          </Button>
          <LoadingButton type="submit" variant="contained" loading={finalizeForm}>
            Salvar
          </LoadingButton>
        </Stack>
      </Stack>
    </Grid>
  );
}
