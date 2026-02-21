'use client';
import { IUseTableApi } from '@/components';
import { ICaixaLancamento, ILancamentoFindAllFilter } from '@/models';
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormContext } from 'react-hook-form';
import { LancamentoCaixa } from './lancamento-caixa';

// ----------------------------------------------------------------------

interface Props {
  fetchData: () => void;
}

export const LancamentoTableFilter = ({ fetchData }: Props) => {
  const { clearErrors, setError, setValue, watch } =
    useFormContext<IUseTableApi<ICaixaLancamento, ILancamentoFindAllFilter>>();
  const { loading, extra } = watch();

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Grid container spacing={2}>
        <LancamentoCaixa
          names={{
            dateStart: 'extra.dataInicial',
            caixa: 'extra.caixa',
          }}
          key={extra?.caixa}
        />

        <Grid xs={4} />
        <Grid xs={2}>
          <Stack alignItems="flex-end" direction={{ sx: 'column', md: 'row' }} spacing={2}>
            <LoadingButton
              type="button"
              variant="contained"
              loading={loading}
              onClick={() => {
                if (!watch('extra.dataInicial'))
                  setError('extra.dataInicial', {
                    type: 'required',
                    message: 'Data Inicial é obrigatório',
                  });
                if (!watch('extra.caixa'))
                  setError('extra.caixa', { type: 'required', message: 'Caixa é obrigatório' });
                if (watch('extra.dataInicial') && watch('extra.caixa')) {
                  setValue('page', 1);
                  clearErrors();
                  fetchData();
                }
              }}
              fullWidth
            >
              Pesquisar
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};
