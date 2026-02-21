'use client';

import { FormEndereco } from '@/components';
import { IFiscalContext } from '@/models';
import { Card, MenuItem, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

interface Props {
  context: IFiscalContext;
}

export function ParametroFormInformacoesGerais({ context }: Props) {
  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3} columnSpacing={2}>
          <Grid xs={12}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Configurações de emissão
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Stack spacing={2} direction={{ sx: 'column', md: 'row' }}>
              <RHFTextField name="cnpj" label="CNPJ" mask="cnpj" />
              <RHFTextField name="razaoSocial" label="Razão Social" />
              <RHFTextField name="nomeFantasia" label="Nome Fantasia" />
            </Stack>
          </Grid>
          <Grid xs={12} md={5}>
            <RHFTextField name="email" label="Email" />
          </Grid>
          <Grid xs={12} md={7}>
            <Stack spacing={2} direction={{ sx: 'column', md: 'row' }}>
              <RHFTextField name="telefone" label="Telefone" mask="telefoneCelular" />
              <RHFTextField name="inscricaoEstadual" label="Inscrição Estadual" />
            </Stack>
          </Grid>

          <Grid xs={12}>
            <Stack spacing={2} direction={{ sx: 'column', md: 'row' }}>
              <RHFSelect name="ambiente" label="Ambiente de Emissão">
                {context?.ambienteEmissao?.map((item) => (
                  <MenuItem key={item.cod} value={item.cod}>
                    {item.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="crt" label="CRT">
                {context?.crt?.map((item) => (
                  <MenuItem key={item.cod} value={item.cod}>
                    {item.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="csc" label="CSC" />
              <RHFTextField name="token" label="Token" />
            </Stack>
          </Grid>
          <Grid xs={12} md={2} pt={2.5}>
            <RHFSwitch name="contingencia" label="Contingência" />
          </Grid>
          <Grid xs={12} md={10}>
            <RHFTextField name="justificativaContingencia" label="Justificativa Contingência" />
          </Grid>
          <Grid xs={12}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Endereço
            </Typography>
          </Grid>

          <Grid xs={12}>
            <FormEndereco
              skipFirstFill={true}
              names={{
                cep: 'enderecoCep',
                estado: 'enderecoEstado',
                cidade: 'enderecoCidadeIbge',
                cidadeNome: 'enderecoCidade',
                logradouro: 'enderecoLogradouro',
                bairro: 'enderecoBairro',
                numero: 'enderecoNumero',
                complemento: 'enderecoComplemento',
              }}
              endFinalColumn={
                <>
                  <RHFTextField name="codigoPais" label="Código País" mask="number" />
                  <RHFTextField name="nomePais" label="Nome País" />
                </>
              }
            />
          </Grid>
          <Grid xs={12}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Responsável Técnico
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Stack spacing={2} direction={{ sx: 'column', md: 'row' }}>
              <RHFTextField name="responsavelTecnicoCnpj" label="CNPJ" mask="cnpj" />
              <RHFTextField name="responsavelTecnicoNomeContato" label="Nome do Contato" />
              <RHFTextField name="responsavelTecnicoEmail" label="Email" />
              <RHFTextField
                name="responsavelTecnicoTelefone"
                label="Telefone"
                mask="telefoneCelular"
              />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Contabilidade
            </Typography>
          </Grid>
          <Grid xs={9}>
            <RHFTextField name="contadorCnpj" label="CPF / CNPJ" mask="cpfOrCnpj" />
          </Grid>
          <Grid xs={3}>
            <RHFSelect name="timezone" label="Fuso horário">
              {['-02:00', '-03:00', '-04:00', '-05:00']?.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </RHFSelect>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
