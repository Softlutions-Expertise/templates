'use client';

import { IEstabelecimentoContext } from '@/models';
import { estabelecimentoService } from '@/services';
import { Card, MenuItem, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export function PainelDigitalFormInformacoes() {
  const [context, setContext] = useState<IEstabelecimentoContext>({} as IEstabelecimentoContext);

  useEffect(() => {
    estabelecimentoService.context().then((response) => {
      setContext(response);
    });
  }, []);

  return (
    <>
      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 2 }}>
            Informações
          </Typography>
          <Grid container spacing={3}>
            <Grid xs={6} md={3}>
              <RHFSwitch name="ativo" label="Ativo" />
            </Grid>
            <Grid xs={12}>
              <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
                <RHFTextField name="nome" label="Nome" />
                <RHFTextField name="ip" label="IP" />
                <RHFSelect name="tipoPainel" label="Tipo Painel">
                  {context?.tipoPainel?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  );
}
