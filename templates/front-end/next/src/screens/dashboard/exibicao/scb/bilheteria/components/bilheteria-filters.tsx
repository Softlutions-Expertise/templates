'use client';

import { IUseTableApi } from '@/components';
import { IBilheteriaFindAll, IBilheteriaFindAllFilter } from '@/models';
import { LoadingButton } from '@mui/lab';
import { Button, Card, FormControlLabel, MenuItem, Stack, Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFDatePicker, RHFSelect } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { scbService } from '@/services/dashboard/exibicao/scb/scb-service';

// ----------------------------------------------------------------------

interface Props {
  fetchData: () => void;
}

export const BilheteriaFilters = ({ fetchData }: Props) => {
  const handleError = useError();

  const { watch, setValue } =
    useFormContext<IUseTableApi<IBilheteriaFindAll, IBilheteriaFindAllFilter>>();
  const { loading, extra } = watch();

  const [statusList, setStatusList] = useState<{ cod: number; descricao: string }[]>([]);

  const handleClearFilters = () => {
    setValue('extra.dataCinematografica', undefined);
    setValue('extra.retificadora', false);
    setValue('extra.statusProtocolo', undefined);
  };

  useEffect(() => {
    scbService
      .context?.()
      .then((ctx) => {
        setStatusList(ctx.statusProtocolo || []);
      })
      .catch((error) => handleError(error, 'Erro ao consultar contexto da bilheteria'));
  }, []);

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <RHFDatePicker
              name="extra.dataCinematografica"
              label="Data Cinematográfica"
              size="small"
            />

            <RHFSelect
              name="extra.statusProtocolo"
              label="Status do Protocolo"
              size="small"
              cleanFild
            >
              {statusList.map((item) => (
                <MenuItem key={item.cod} value={item.cod}>
                  {item.descricao}
                </MenuItem>
              ))}
            </RHFSelect>

            <FormControlLabel
              control={
                <Switch
                  checked={extra?.retificadora || false}
                  onChange={(e) => setValue('extra.retificadora', e.target.checked)}
                />
              }
              label={<Typography variant="body2">Retificadora</Typography>}
            />
          </Stack>
        </Grid>

        <Grid xs={8} />
        <Grid xs={4}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-end">
            <Button variant="outlined" fullWidth onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
            <LoadingButton
              variant="contained"
              type="button"
              loading={loading}
              onClick={() => {
                setValue('page', 1);
                fetchData();
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
