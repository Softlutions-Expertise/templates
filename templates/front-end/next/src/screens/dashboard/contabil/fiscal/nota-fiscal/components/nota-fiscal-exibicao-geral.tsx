import { Card, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

export function NotaFiscalExibicaoGeral() {
  return (
    <Grid xs={12} md={6}>
      <Card sx={{ p: 2 }}>
        <Stack spacing={3}>
          <Grid container spacing={2} columnSpacing={2}>
            <Grid xs={12} md={4}>
              <RHFTextField name="numero" label="Nº nota" size="small" disabled />
            </Grid>
            <Grid xs={12} md={8}>
              <RHFTextField name="status" label="Status da nota" size="small" disabled />
            </Grid>
            <Grid xs={12}>
              <Stack spacing={1.8} direction={{ sx: 'column', md: 'row' }}>
                <RHFTextField name="dataHoraEmissao" label="Emissão" size="small" disabled />
                <RHFTextField
                  name="dataHoraSaidaEntrada"
                  label="Saída / Entrada"
                  size="small"
                  disabled
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
