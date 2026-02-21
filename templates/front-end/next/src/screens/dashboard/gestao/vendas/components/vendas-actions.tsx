import { IVendasFinalizeForm, IVendasViewer } from '@/models';
import { pages, useRouter } from '@/routes';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = {
  finalizeForm: IVendasFinalizeForm;
  setFinalizeForm: (value: IVendasFinalizeForm) => void;
};

export function VendasActions({ finalizeForm, setFinalizeForm }: Props) {
  const { watch } = useFormContext();
  const values: IVendasViewer = watch() as IVendasViewer;
  const router = useRouter();

  return (
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
          onClick={() => router.push(pages.dashboard.gestao.vendas.list.path)}
        >
          Voltar
        </Button>
      </Stack>
    </Grid>
  );
}
