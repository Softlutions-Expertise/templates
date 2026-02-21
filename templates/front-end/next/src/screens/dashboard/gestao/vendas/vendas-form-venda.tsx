import { Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

export function VendasFormVenda() {
  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Typography variant="h6">Informações gerais</Typography>
          </Grid>
          <Grid xs={12} md={2}>
            <RHFTextField name="id" label="Código" readOnly />
          </Grid>
          <Grid xs={12} md={3}>
            <RHFTextField name="data" label="Data" readOnly />
          </Grid>
          <Grid xs={12} md={3}>
            <RHFTextField name="hora" label="Hora" readOnly />
          </Grid>
          <Grid xs={12} md={4}>
            <RHFTextField name="origem" label="Origem" readOnly />
          </Grid>
          <Grid xs={12}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <RHFTextField name="localizador" label="Localizador" readOnly />
              <RHFTextField name="valorTotal" label="Valor Total" readOnly />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <RHFTextField name="dataHoraImpressao" label="Data e Hora da Impressão" readOnly />
              <RHFTextField name="terminalImpressao" label="Terminal Impressão" readOnly />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Typography variant="h6">Informações do cliente</Typography>
          </Grid>
          <Grid xs={12}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <RHFTextField name="cliente.id" label="Código" readOnly />
              <RHFTextField name="cliente.nome" label="Nome" readOnly />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Typography variant="h6">Informações da Sessão</Typography>
          </Grid>
          <Grid xs={12}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <RHFTextField name="sessao.id" label="Código" readOnly />
              <RHFTextField name="sessao.filme" label="Filme" readOnly />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <RHFTextField name="sessao.data" label="Data" readOnly />
              <RHFTextField name="sessao.hora" label="Hora" readOnly />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <RHFTextField name="sessao.tipoProjecao.descricao" label="Tipo Projeção" readOnly />
              <RHFTextField name="sessao.idiomaExibicao.descricao" label="Idioma" readOnly />
              <RHFTextField name="sessao.tipoSessao.descricao" label="Tipo Sessão" readOnly />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <RHFTextField name="observacoes" label="Histórico" rows={5} multiline readOnly />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
