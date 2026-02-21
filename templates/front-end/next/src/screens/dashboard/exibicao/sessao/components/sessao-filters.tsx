'use client';

import { IUseTableApi } from '@/components';
import { useError } from '@softlutions/hooks';
import { sessaoService } from '@/services/dashboard/exibicao/sessao/sessao-service';
import { IFilmeOption, ISalaContext } from '@/models';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFAutocomplete, RHFDatePicker } from '@softlutions/components';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  fetchData: () => void;
}

export function SessaoFilters({ fetchData }: Props) {
  const { setValue, watch, resetField } = useFormContext<IUseTableApi<any, any>>();

  const { loading } = watch();
  const previousDataInicial = useRef<any>(null);
  const handleError = useError();

  const [filmes, setFilmes] = useState<IFilmeOption[]>([]);
  const [salas, setSalas] = useState<ISalaContext[]>([]);

  const handleFilmeInput = async (_: any, input: string) => {
    try {
      const response = await sessaoService.searchFilme(input || '');
      setFilmes(response || []);
    } catch (err) {
      handleError(err, 'Erro ao buscar filmes');
    }
  };

  const handleSalaInput = async (_: any, input: string) => {
    try {
      const response = await sessaoService.searchSala(input || '');
      setSalas(response || []);
    } catch (err) {
      handleError(err, 'Erro ao buscar salas');
    }
  };

  const handleClearFilters = () => {
    resetField('extra.filme');
    resetField('extra.sala');
    setValue('extra.dataInicial', null, { shouldValidate: true, shouldDirty: true });
    setValue('extra.dataFinal', null, { shouldValidate: true, shouldDirty: true });
    previousDataInicial.current = null;
    fetchData();
  };

  useEffect(() => {
    handleFilmeInput(null, '');
    handleSalaInput(null, '');
    previousDataInicial.current = watch('extra.dataInicial');
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'extra.dataInicial') {
        const newDate = value.extra?.dataInicial;
        const currentDataFinal = value.extra?.dataFinal;
        const oldDataInicial = previousDataInicial.current;

        const getDateValue = (date: any) => {
          if (!date) return null;
          if (date instanceof Date) return date.getTime();
          if (typeof date === 'string') return new Date(date).getTime();
          return null;
        };

        const currentDataFinalTime = getDateValue(currentDataFinal);
        const oldDataInicialTime = getDateValue(oldDataInicial);

        if (!currentDataFinalTime || (oldDataInicialTime && currentDataFinalTime === oldDataInicialTime)) {
          setValue('extra.dataFinal', newDate);
        }

        previousDataInicial.current = newDate;
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
            <RHFDatePicker name="extra.dataInicial" label="Data Inicial" size="small" />

            <RHFDatePicker name="extra.dataFinal" label="Data Final" size="small" />

            <RHFAutocomplete
              fullWidth
              name="extra.sala"
              label="Sala"
              size="small"
              options={salas}
              getOptionLabel={(option: any) => option?.descricao || ''}
              isOptionEqualToValue={(opt: any, val: any) => (opt?.cod) === (val?.cod)}
              onInputChange={handleSalaInput}
              noOptionsText="Nenhuma sala encontrada"
              value={watch('extra.sala') || null}
            />

            <RHFAutocomplete
              fullWidth
              name="extra.filme"
              label="Filme"
              size="small"
              options={filmes}
              getOptionLabel={(option: any) => option?.descricao || ''}
              isOptionEqualToValue={(opt: any, val: any) => (opt?.cod) === (val?.cod)}
              onInputChange={handleFilmeInput}
              noOptionsText="Nenhum filme encontrado"
              value={watch('extra.filme') || null}
            />
          </Stack>
        </Grid>

        <Grid xs={8} />
        <Grid xs={4}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-end">
            <Button fullWidth variant="outlined" onClick={handleClearFilters}>
              Limpar filtros
            </Button>
            <LoadingButton
              fullWidth
              variant="contained"
              loading={loading}
              onClick={() => {
                setValue('page', 1);
                fetchData();
              }}
            >
              Pesquisar
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
