'use client';

import { RHFUploadBox } from '@/components';
import { IParametroUpdate } from '@/models';
import { Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFTextField } from '@softlutions/components';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

export function ParametroFormCertificadoDigital() {
  const { watch } = useFormContext();

  const values: IParametroUpdate = watch() as IParametroUpdate;

  return (
    <>
      <Grid xs={12} md={3}>
        <Card sx={{ p: 2 }}>
          <Stack spacing={3} alignItems={'center'} textAlign={'center'}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Certificado Digital
            </Typography>
            <RHFUploadBox
              name="certificadoDigital"
              accept={{
                'application/x-pkcs12': ['.pfx', '.p12'],
              }}
            />
            {values.certificadoDigital && (
              <Typography variant="caption" sx={{ color: 'green' }}>
                Arquivo adicionado
              </Typography>
            )}
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12} md={9}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
            <RHFTextField name="senhaCertificado" label="Senha do Certificado" /*type="password"*/ />
            <RHFTextField name="validadeCertificado" label="Validade do Certificado" />
          </Stack>
        </Card>
      </Grid>
    </>
  );
}
