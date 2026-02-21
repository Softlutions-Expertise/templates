'use client';

import { useSnackbar } from '@/components';
import { IDownloadsCreate } from '@/models';
import { downloadService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFAutocomplete, RHFDatePicker, RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { yup } from '@softlutions/utils';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DOWNLOAD_ENUMS } from './enums';

// ----------------------------------------------------------------------

export function DownloadCreateEditForm() {
  const handleError = useError();

  const { enqueueSnackbar } = useSnackbar();

  const [loader, setLoader] = useState<boolean>(false);

  const validationShema = yup.object().shape({
    dataInicial: yup.string().required('Data Inicial é obrigatória'),
    dataFinal: yup.string().required('Data Final é obrigatória'),
    tipo: yup.mixed().required('Tipo é obrigatório'),
  });

  const methods = useForm({
    resolver: yupResolver(validationShema),
    defaultValues: {
      tipo: '',
      dataInicial: '',
      dataFinal: '',
    },
  });

  const { setValue, watch } = methods;
  const values = watch();

  const onSubmit = async (data: IDownloadsCreate) => {
    setLoader(true);
    handleCreat(data as IDownloadsCreate);
  };

  const handleCreat = async (data: IDownloadsCreate) => {
    downloadService
      .create(data)
      .then(() => enqueueSnackbar('Download Gerado com sucesso'))
      .catch((error) => handleError(error, 'Erro ao gerar download'))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    if (values?.dataInicial && values?.dataFinal) setValue('dataFinal', values?.dataInicial);
  }, [values?.dataInicial]);

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="tipo"
                label="Tipo"
                options={DOWNLOAD_ENUMS.TIPO}
                getOptionLabel={(option: any) => option?.label || ''}
                isOptionEqualToValue={(opt, val) => opt.nome === val.nome}
                fullWidth
              />
              <RHFDatePicker name="dataInicial" label="Data inicial" />
              <RHFDatePicker
                name="dataFinal"
                label="Data Final"
                minDate={new Date(values?.dataInicial || '')}
                disabled={!values.dataInicial}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={loader}>
                Emitir Relatório
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </RHFFormProvider>
  );
}
