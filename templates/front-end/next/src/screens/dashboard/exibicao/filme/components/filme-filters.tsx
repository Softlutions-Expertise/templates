'use client';

import { IUseTableApi } from '@/components';
import { IFilme, IFilmeFilter, IFilmeContext } from '@/models';
import { filmeService } from '@/services';
import { LoadingButton } from '@mui/lab';
import { Button, Card, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFSelect, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  fetchData: () => void;
}

export const FilmeFilters = ({ fetchData }: Props) => {
  const handleError = useError();

  const [context, setContext] = useState<IFilmeContext>();

  const { setValue, watch } = useFormContext<IUseTableApi<IFilme, IFilmeFilter>>();
  const { loading, extra } = watch();

  const handleClearFilters = () => {
    setValue('extra.titulo', '');
    setValue('extra.genero', '' as any);
    setValue('extra.classificacaoIndicativa', '' as any);
    setValue('search', '');
  };

  useEffect(() => {
    filmeService
      .context()
      .then((response) => {setContext(response), console.log(response)})
      .catch((error) => handleError(error, 'Erro ao consultar contexto de filmes!'));
  }, []);

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
            <RHFTextField name="search" label="Título" size="small" />
            <RHFSelect name="extra.genero" label="Gênero" size="small" cleanFild>
              {context?.genero?.map((item) => (
                <MenuItem key={item?.cod} value={item?.cod}>
                  {item?.descricao}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect
              name="extra.classificacaoIndicativa"
              label="Classificação Indicativa"
              size="small"
              cleanFild
            >
              {context?.classificacaoIndicativa?.map((item) => (
                <MenuItem key={item?.cod} value={item?.cod}>
                  {item?.descricao}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Grid>

        <Grid xs={8} />
        <Grid xs={4}>
          <Stack alignItems="flex-end" direction={{ sx: 'column', md: 'row' }} spacing={2}>
            <Button fullWidth variant="outlined" onClick={() => handleClearFilters()}>
              Limpar filtros
            </Button>
            <LoadingButton
              type="button"
              variant="contained"
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
