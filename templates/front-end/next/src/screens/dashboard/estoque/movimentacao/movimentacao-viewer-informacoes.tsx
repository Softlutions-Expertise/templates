import { IMovimentacao } from '@/models';
import { Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider, RHFTextField } from '@softlutions/components';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IMovimentacao;
}

export function MovimentacaoViewerInformacoes({ currentData }: Props) {
  const defaultValues = useMemo(
    () => ({
      tipoMovimentacao: currentData?.tipoMovimentacao?.descricao,
      naturezaMovimentacao: currentData?.naturezaMovimentacao?.descricao,
      tipoDocumentoReferencia: currentData?.tipoDocumentoReferencia,
      identificadorDocumentoReferencia: currentData?.identificadorDocumentoReferencia,
      quantidadeItens: currentData?.quantidadeItens,
      dataHoraMovimento: currentData?.dataHoraMovimento,
      entidade: currentData?.entidade,
      itens: currentData?.itens,
    }),
    [currentData],
  );

  const methods = useForm({
    defaultValues,
  });

  return (
    <RHFFormProvider methods={methods}>
      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações da movimentação
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <RHFTextField name="tipoMovimentacao" label="Tipo da movimentação" disabled />
                <RHFTextField
                  name="naturezaMovimentacao"
                  label="Natureza da movimentação"
                  disabled
                />
                <RHFTextField
                  name="tipoDocumentoReferencia"
                  label="Tipo do documento de referência"
                  disabled
                />

                <RHFTextField
                  name="identificadorDocumentoReferencia"
                  label="Identificador do documento de referência"
                  disabled
                />
              </Stack>
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField name="quantidadeItens" label="Quantidade de itens" disabled />
                <RHFTextField
                  name="dataHoraMovimento"
                  label="Data e hora da movimentação"
                  disabled
                />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações da pessoa
              </Typography>
            </Grid>
            <Grid xs={12} md={1}>
              <RHFTextField name="entidade.id" label="ID" disabled />
            </Grid>
            <Grid xs={12} md={11}>
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <RHFTextField name="entidade.nome" label="Nome" disabled />
                <RHFTextField name="entidade.tipoEntidade.descricao" label="Tipo" disabled />
                <RHFTextField name="entidade.cpfCnpj" label="CPF/CNPJ" mask="cpfOrCnpj" disabled />
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </RHFFormProvider>
  );
}
