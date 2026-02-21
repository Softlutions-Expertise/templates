import { FormEndereco, } from '@/components';
import { IFiscalContext } from '@/models';
import { Card, MenuItem, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

interface Props {
  context: IFiscalContext;
}

export function NotaFiscalFormDestinatario({ context }: Props) {
  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações
              </Typography>
            </Grid>

            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField name="destinatarioNome" label="Nome / Razão Social" />
                <RHFTextField name="destinatarioCpfCnpj" label="CPF / CNPJ" mask="cpfOrCnpj" />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField name="destinatarioTelefone" label="Telefone" mask="telefoneCelular" />
                <RHFTextField name="destinatarioEmail" label="Email" />
                <RHFTextField name="destinatarioInscricaoEstadual" label="Inscrição Estadual" />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems={'center'}>
                <RHFSelect name="presencaComprador" label="Indicador presença comprador">
                  {context?.presencaComprador?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect name="indicadorIeDestinatario" label="Indicador I.E destinatário">
                  {context?.identificadorIeDestinatario?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSwitch
                  name="consumidorFinal"
                  label="Consumidor Final"
                  sx={{
                    '.MuiTypography-root': { whiteSpace: 'nowrap' },
                  }}
                />
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Endereço
              </Typography>
            </Grid>

            <Grid xs={12}>
              <FormEndereco
                names={{
                  cep: 'destinatarioEnderecoCep',
                  estado: 'destinatarioEnderecoEstado',
                  cidade: 'destinatarioEnderecoCidadeIbge',
                  cidadeNome: 'destinatarioEnderecoCidade',
                  logradouro: 'destinatarioEnderecoLogradouro',
                  bairro: 'destinatarioEnderecoBairro',
                  numero: 'destinatarioEnderecoNumero',
                  complemento: 'destinatarioEnderecoComplemento',
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
