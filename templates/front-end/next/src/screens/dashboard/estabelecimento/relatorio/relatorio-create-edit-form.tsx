import { RHFToggleButton, useSnackbar } from '@/components';
import { IRelatorioCreate } from '@/models';
import { LOCAL_API, relatorioService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Box, Card, Stack, TextField, ToggleButton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFDatePicker, RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { getLocalItem, yup } from '@softlutions/utils';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RELATORIO_ENUMS } from './enums';
import { IRelatorioType } from './views/relatorio-create-view';

// ----------------------------------------------------------------------

export function RelatorioCreateEditForm({ typeForm }: IRelatorioType) {
  const handleErrors = useError();

  const { enqueueSnackbar } = useSnackbar();

  const [loader, setLoader] = useState<boolean>(false);

  const notDate = 'estoque-atual'

  const validationShema = yup.object().shape({
    relatorio: yup
      .object()
      .shape({
        id: yup.mixed(),
        rota: yup.mixed(),
        descricao: yup.string().required(),
        bloquearData: yup.boolean().optional(),
      })
      .required('Relatório é obrigatório'),
    dataStart: yup.string().test('required', 'Data Inicial é obrigatório', function (value) {
      const relatorio = this.parent.relatorio;
      if (relatorio?.id === notDate || relatorio?.bloquearData) return true;
      return !!value;
    }),
    dataEnd: yup.string().test('required', 'Data Final é obrigatório', function (value) {
      const relatorio = this.parent.relatorio;
      if (relatorio?.id === notDate || relatorio?.bloquearData) return true;
      return !!value;
    }),
    tipoPeriodo: yup.string().test('required', 'Tipo Período é obrigatório', (value) => {
      if (typeForm === 'venda') return !!value;
      return true;
    }),
  });

  const methods = useForm({
    resolver: yupResolver(validationShema),
    defaultValues: {
      tipoPeriodo: '',
      dataStart: '',
      dataEnd: '',
    },
  });

  const { setValue, watch } = methods;
  const values = watch();

  const onSubmit = async (data: IRelatorioCreate) => {
    setLoader(true);
    const unidade = getLocalItem('unidade');

    data.relatorio.rota = ['caixa-dataorigem'].includes(data?.relatorio?.id || '')
      ? unidade?.versaoApi === data?.relatorio?.versaoApi
        ? data?.relatorio?.rotaV2
        : data?.relatorio?.rota?.(data.tipoPeriodo)
      : unidade?.versaoApi === data?.relatorio?.versaoApi
        ? data?.relatorio?.rotaV2 || data?.relatorio?.rota
        : data?.relatorio?.rota;


    handleCreat({ ...data, unidade: LOCAL_API, } as IRelatorioCreate);
  };

  const handleCreat = async (data: IRelatorioCreate) => {
    relatorioService
      .create(data)
      .then(() => enqueueSnackbar('Relatório Gerado com sucesso'))
      .catch((error) => handleErrors(error, 'Erro ao gerar relatório'))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    if (values.dataStart && values.dataEnd) setValue('dataEnd', values.dataStart);
  }, [values.dataStart]);

  useEffect(() => {
    if (values?.relatorio?.bloquearData || values?.relatorio?.id === notDate) {
      setValue('dataStart', '');
      setValue('dataEnd', '');
    }
  }, [values?.relatorio]);

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
              {typeForm === 'venda' && (
                <RHFToggleButton name="tipoPeriodo" label="Tipo Período" sx={{ mb: -1 }}>
                  {RELATORIO_ENUMS.TIPO.map((item) => (
                    <ToggleButton key={item.id} value={item.id} disabled={item.disabled}>
                      {item.nome}
                    </ToggleButton>
                  ))}
                </RHFToggleButton>
              )}
              <Controller
                name="relatorio"
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    fullWidth
                    autoHighlight
                    options={RELATORIO_ENUMS.RELATORIOS?.[
                      typeForm as keyof typeof RELATORIO_ENUMS.RELATORIOS
                    ]?.map((option) => option)}
                    onChange={(_, newValue) => {
                      setValue('relatorio', newValue, { shouldValidate: true });
                    }}
                    getOptionLabel={(option) => option.descricao}
                    renderOption={(props, option) => (
                      <>
                        <Box
                          component="li"
                          sx={{
                            '& > img': { mr: 2, flexShrink: 0 },
                            opacity: option.disabled ? 0.5 : 1,
                            cursor: option.disabled ? 'not-allowed' : 'pointer',
                            ...(option.disabled && {
                              color: 'text.disabled',
                              textDecoration: 'line-through',
                            }),
                          }}
                          {...props}
                        >
                          {option.descricao}
                        </Box>
                      </>
                    )}
                    renderInput={(params) => (
                      <TextField
                        label="Relatório"
                        error={!!error}
                        helperText={error?.message}
                        {...params}
                      />
                    )}
                  />
                )}
              />

              <RHFDatePicker
                name="dataStart"
                label="Data inicial"
                disabled={values?.relatorio?.id === notDate || values?.relatorio?.bloquearData}
              />
              <RHFDatePicker
                name="dataEnd"
                label="Data Final"
                minDate={new Date(values?.dataStart || '')}
                disabled={!values.dataStart || values?.relatorio?.id === notDate || values?.relatorio?.bloquearData}
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
