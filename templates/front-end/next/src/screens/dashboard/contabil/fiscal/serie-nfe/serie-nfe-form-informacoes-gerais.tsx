import { IFiscalContext } from '@/models';
import { Card, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

interface Props {
  context?: IFiscalContext;
  isEdit?: boolean;
}

export function SerieNfeFormInformacoesGerais({ context, isEdit }: Props) {
  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12} md={12}>
              <RHFSwitch name="padrao" label="Padrão" />
            </Grid>

            <Grid xs={12} md={5}>
              <RHFSelect name="modelo" label="Modelo" disabled={isEdit}>
                {context?.modeloDocumentoFiscal?.map((item) => (
                  <MenuItem key={item.cod} value={item.cod}>
                    {item.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Grid xs={12} md={3}>
              <RHFSelect name="ambiente" label="Ambiente" disabled={isEdit}>
                {context?.ambienteEmissao?.map((item) => (
                  <MenuItem key={item.cod} value={item.cod}>
                    {item.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Grid xs={12} md={2}>
              <RHFTextField name="serie" label="Série" type="number" disabled={isEdit} />
            </Grid>

            <Grid xs={12} md={2}>
              <RHFTextField name="numero" label="Número" type="number" />
            </Grid>

            <Grid xs={12}>
              <RHFTextField rows={3} name="descricao" label="Descrição" multiline />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
