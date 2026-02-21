import { FormEndereco, } from '@/components';
import { RHFTextField } from '@softlutions/components';

import { Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

export function NotaFiscalFormEmitente() {
  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações do emissor
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField name="emitenteNome" label="Nome / Razão Social" disabled />
                <RHFTextField name="emitenteCpfCnpj" label="CPF / CNPJ" mask="cpfOrCnpj" disabled />
                <RHFTextField
                  name="emitenteTelefone"
                  label="Telefone"
                  mask="telefoneCelular"
                  disabled
                />
                <RHFTextField
                  name="emitenteInscricaoEstadual"
                  label="Inscrição Estadual"
                  disabled
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
                disabledAll
                names={{
                  cep: 'emitenteEnderecoCep',
                  estado: 'emitenteEnderecoEstado',
                  cidade: 'emitenteEnderecoCidadeIbge',
                  cidadeNome: 'emitenteEnderecoCidade',
                  logradouro: 'emitenteEnderecoLogradouro',
                  bairro: 'emitenteEnderecoBairro',
                  numero: 'emitenteEnderecoNumero',
                  complemento: 'emitenteEnderecoComplemento',
                }}
                endFinalColumn={
                  <>
                    <RHFTextField name="emitenteCodigoPais" label="Código País" disabled />
                    <RHFTextField name="emitenteNomePais" label="Nome País" disabled />
                  </>
                }
                skipFirstFill={true}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
