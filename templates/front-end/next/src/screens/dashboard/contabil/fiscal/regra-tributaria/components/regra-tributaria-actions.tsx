import { pages, useRouter } from '@/routes';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

interface Props {
  finalizeForm: boolean;
}

export function RegraTributariaActions({ finalizeForm }: Props) {
  const router = useRouter();

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
            onClick={() => router.push(pages.dashboard.contabil.fiscal.regraTributaria.list.path)}
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
