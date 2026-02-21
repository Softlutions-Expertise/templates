import { Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFTextField } from '@softlutions/components';

import { NotaFiscalProtocoloList } from './components';

// ----------------------------------------------------------------------

export function NotaFiscalFormProtocolo() {
  return (
    <>
      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Grid container spacing={3} columnSpacing={2}>
              <Grid xs={12}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  Nota Fiscal Eletrônica
                </Typography>
              </Grid>
              <Grid xs={12}>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <RHFTextField name="codigo" label="Código" disabled />
                  <RHFTextField name="protocolo" label="Protocolo" disabled />
                  <RHFTextField name="protocoloDataHora" label="Data e hora" disabled />
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <RHFTextField name="chaveAcesso" label="Chave de acesso" disabled />
                  <RHFTextField
                    name="chaveAcessoAdicional"
                    label="Chave de acesso adicional"
                    disabled
                  />
                </Stack>
              </Grid>

              <Grid xs={12}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  Contingência
                </Typography>
              </Grid>

              <Grid xs={12} md={3}>
                <RHFTextField name="contingencia" label="Emitido em contingência" disabled />
              </Grid>
              <Grid xs={12} md={9}>
                <RHFTextField name="justificativaContingencia" label="Justificativa" disabled />
              </Grid>
            </Grid>
          </Stack>
        </Card>
        <NotaFiscalProtocoloList />
      </Grid>
    </>
  );
}
