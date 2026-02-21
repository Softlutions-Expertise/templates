import { FormEndereco, FormUfCidade } from '@/components';
import { IFiscalContext, INotaFiscalLogistica } from '@/models';
import { Card, MenuItem, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  context: IFiscalContext;
}

export function NotaFiscalFormLogistica({ context }: Props) {
  const { watch, setValue } = useFormContext();
  const values: INotaFiscalLogistica = watch() as INotaFiscalLogistica;

  useEffect(() => {
    if (values.entregaMesmoEnderecoDestinatario) {
      const fields = [
        'entregaNome',
        'entregaCpfCnpj',
        'entregaTelefone',
        'entregaEmail',
        'entregaInscricaoEstadual',
        'entregaEnderecoCep',
        'entregaEnderecoEstado',
        'entregaEnderecoCidadeIbge',
        'entregaEnderecoCidade',
        'entregaEnderecoLogradouro',
        'entregaEnderecoBairro',
        'entregaEnderecoNumero',
        'entregaEnderecoComplemento',
      ];

      fields.forEach((field) => {
        setValue(
          field,
          values[field.replace('entrega', 'destinatario') as keyof INotaFiscalLogistica],
        );
      });
    }
  }, [values.entregaMesmoEnderecoDestinatario]);

  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Transportador
              </Typography>
            </Grid>
            <Grid xs={8} md={4}>
              <RHFSelect name="modalidadeFrete" label="Modalidade de frete">
                {context?.modalidadeFrete?.map((item) => (
                  <MenuItem value={item.cod}>{item.descricao}</MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid xs={12} md={5}>
              <RHFTextField name="transportadorNome" label="Nome / Razão Social" />
            </Grid>

            <Grid xs={4} md={3}>
              <RHFTextField name="transportadorCpfCnpj" label="CPF / CNPJ" mask="cpfOrCnpj" />
            </Grid>

            <Grid xs={12} md={6}>
              <RHFTextField name="transportadorEnderecoCompleto" label="Endereço completo" />
            </Grid>

            <Grid xs={12} md={4}>
              <FormUfCidade
                names={{
                  estado: 'transportadorEstado',
                  cidade: 'transportadorCidadeIbge',
                  cidadeNome: 'transportadorCidade',
                }}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField name="transportadorInscricaoEstadual" label="Inscrição estadual" />
            </Grid>

            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Volumes transportados
              </Typography>
            </Grid>

            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField name="volumeQuantidade" label="Quantidade" />
                <RHFTextField name="volumeEspecie" label="Espécie" />
                <RHFTextField name="volumeMarca" label="Marca" />
                <RHFTextField name="volumeNumero" label="Número" />
                <RHFTextField name="volumePesoBruto" label="Peso bruto" mask="kg" />
                <RHFTextField name="volumePesoLiquido" label="Peso líquido" mask="kg" />
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Entrega
              </Typography>
            </Grid>
            <Grid xs={12}>
              <RHFSwitch
                name="entregaMesmoEnderecoDestinatario"
                label="Mesmo endereço do destinatário"
              />
            </Grid>

            <Grid xs={12}>
              <FormEndereco
                names={{
                  cep: 'entregaEnderecoCep',
                  estado: 'entregaEnderecoEstado',
                  cidade: 'entregaEnderecoCidadeIbge',
                  cidadeNome: 'entregaEnderecoCidade',
                  logradouro: 'entregaEnderecoLogradouro',
                  bairro: 'entregaEnderecoBairro',
                  numero: 'entregaEnderecoNumero',
                  complemento: 'entregaEnderecoComplemento',
                }}
                disabledAll={values.entregaMesmoEnderecoDestinatario}
              />
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Dados do recebedor
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField
                  name="entregaNome"
                  label="Nome / Razão Social"
                  disabled={values.entregaMesmoEnderecoDestinatario}
                />
                <RHFTextField
                  name="entregaCpfCnpj"
                  label="CPF / CNPJ"
                  mask="cpfOrCnpj"
                  disabled={values.entregaMesmoEnderecoDestinatario}
                />
                <RHFTextField
                  name="entregaTelefone"
                  label="Telefone"
                  mask="telefoneCelular"
                  disabled={values.entregaMesmoEnderecoDestinatario}
                />
                <RHFTextField
                  name="entregaEmail"
                  label="Email"
                  disabled={values.entregaMesmoEnderecoDestinatario}
                />
                <RHFTextField
                  name="entregaInscricaoEstadual"
                  label="Inscrição Estadual"
                  disabled={values.entregaMesmoEnderecoDestinatario}
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
