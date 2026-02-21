import { IFiscalContext } from '@/models';
import { Card, MenuItem, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFSelect, RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

interface Props {
  context: IFiscalContext;
}

export function FormProcesso({ context }: Props) {
  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações de emissão
              </Typography>
            </Grid>

            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFSelect name="naturezaOperacao" label="Natureza da operação">
                  {context?.naturezaOperacao?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect name="tipoMovimento" label="Tipo Movimento">
                  {context?.tipoMovimento?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFSelect name="modeloDocumentoFiscal" label="Modelo de Documento Fiscal">
                  {context?.modeloDocumentoFiscal?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect name="formatoDanfe" label="Impressão DANFE">
                  {context?.formatoDanfe?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect name="tipoEmissao" label="Tipo de emissão">
                  {context?.tipoEmissao?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFSelect name="identificadorDestino" label="Identificador de Destino">
                  {context?.identificadorDestino?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect name="finalidadeNfe" label="Finalidade da Emissão da NFe">
                  {context?.finalidadeNfe?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Cálculo do imposto
              </Typography>
            </Grid>

            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField
                  name="valorTotalMercadorias"
                  label="Valor Total Mercadorias"
                  mask="money"
                  disabled
                />
                <RHFTextField
                  name="valorTotalDesconto"
                  label="Valor Total Desconto"
                  mask="money"
                  disabled
                />
                <RHFTextField
                  name="valorTotalBaseCalculoIcms"
                  label="Base de Cálculo ICMS"
                  mask="money"
                  disabled
                />
                <RHFTextField
                  name="valorTotalIcms"
                  label="Valor Total ICMS"
                  mask="money"
                  disabled
                />
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField
                  name="valorTotalPis"
                  label="Valor Total Pis"
                  mask="money"
                  disabled
                />
                <RHFTextField
                  name="valorTotalCofins"
                  label="Valor Total Cofins"
                  mask="money"
                  disabled
                />
                <RHFTextField
                  name="valorTotalIpiDevolvido"
                  label="Valor Total IPI Devolvido"
                  mask="money"
                  disabled
                />
                <RHFTextField
                  name="valorTotalTributos"
                  label="Valor Total Tributos"
                  mask="money"
                  disabled
                />
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField
                  name="valorTotalBaseCalculoIbsCbs"
                  label="Valor Base de Cálculo IBS/CBS"
                  mask="money"
                  disabled
                />
                <RHFTextField
                  name="valorTotalIbsUf"
                  label="Valor Total IBS UF"
                  mask="money"
                  disabled
                />
                <RHFTextField
                  name="valorTotalIbsMun"
                  label="Valor Total IBS Mun"
                  mask="money"
                  disabled
                />
                <RHFTextField
                  name="valorTotalCbs"
                  label="Valor Total CBS"
                  mask="money"
                  disabled
                />
              </Stack>
            </Grid>


            <Grid container spacing={2} xs={12}>
                <Grid xs={12} sm={3}>
                  <RHFTextField 
                    name="valorTotalFrete" 
                    label="Valor Total Frete" 
                    mask="money" 
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <RHFTextField 
                    name="valorTotalSeguro" 
                    label="Valor Total Seguro" 
                    mask="money" 
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <RHFTextField
                    name="valorTotalOutrasDespesas"
                    label="Valor Total Outras Despesas"
                    mask="money"
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <RHFTextField
                    name="valorTotalNota"
                    label="Valor Total Nota"
                    mask="money"
                    disabled
                  />
                </Grid>
            </Grid>

            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Dados adicionais
              </Typography>
            </Grid>
            <Grid xs={12}>
              <RHFTextField name="linha1" label="Informações complementares" multiline rows={4} />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
