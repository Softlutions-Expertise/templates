'use client';

import { IUseTableApi } from '@/components';
import { IFiscalContext, INotaFiscalFindAll, INotaFiscalFindAllFilter } from '@/models';
import { fiscalService } from '@/services';
import { LoadingButton } from '@mui/lab';
import { Button, Card, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFDatePicker, RHFSelect, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  fetchData: () => void;
}

export const NotaFiscalFilters = ({ fetchData }: Props) => {
  const handleError = useError();

  const [context, setContext] = useState<IFiscalContext>();

  const { setValue, watch } =
    useFormContext<IUseTableApi<INotaFiscalFindAll, INotaFiscalFindAllFilter>>();
  const { loading, extra } = watch();

  const handleClearFilters = () => {
    Object.keys(extra || {}).forEach((key) => {
      setValue(`extra.${key as keyof INotaFiscalFindAllFilter}`, '');
    });
    setValue('extra.statusProcesso', '');
    setValue('extra.tipoMovimento', '');
  };

  useEffect(() => {
    fiscalService
      .context()
      .then((response) => setContext(response))
      .catch((error) => handleError(error, 'Erro ao consultar contexto fiscal!'));
  }, []);

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
            <RHFDatePicker name="extra.dataInicio" label="Data Inicial" size="small" />
            <RHFDatePicker name="extra.dataFim" label="Data Final" size="small" />
            <RHFSelect name="extra.tipoMovimento" label="Tipo Movimentação" size="small" cleanFild>
              {context?.tipoMovimento?.map((item) => (
                <MenuItem key={item?.cod} value={item?.cod}>
                  {item?.descricao}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="extra.statusProcesso" label="Status" size="small" cleanFild>
              {context?.statusProcesso?.map((item) => (
                <MenuItem key={item?.cod} value={item?.cod}>
                  {item?.descricao}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
            <RHFSelect
              name="extra.modeloDocumentoFiscal"
              label="Modelo Documento Fiscal"
              size="small"
              cleanFild
            >
              {context?.modeloDocumentoFiscal?.map((item) => (
                <MenuItem key={item?.cod} value={item?.cod}>
                  {item?.descricao}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField name="extra.numero" label="Número" size="small" />
            <RHFTextField name="extra.destinatario" label="Destinatário" size="small" />
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
