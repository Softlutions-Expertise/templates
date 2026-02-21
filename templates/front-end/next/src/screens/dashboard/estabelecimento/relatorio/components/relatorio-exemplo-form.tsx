import { useSnackbar } from '@/components';
import { IRelatorioCreate } from '@/models';
import { relatorioService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Box, Card, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFDatePicker, RHFFormProvider, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { getLocalItem, yup } from '@softlutions/utils';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { RELATORIO_ENUMS } from '../enums';
import { IRelatorioType } from '../views/relatorio-create-view';

// ----------------------------------------------------------------------

export function RelatorioExemploForm({ typeForm }: IRelatorioType) {
  const handleErrors = useError();

  const { enqueueSnackbar } = useSnackbar();

  const [loader, setLoader] = useState<boolean>(false);

  const validationShema = yup.object().shape({
    relatorio: yup
      .object()
      .shape({
        id: yup.mixed(),
        rota: yup.mixed(),
        descricao: yup.string().required(),
      })
      .required('Relatório é obrigatório'),
    dataInicial: yup.string().test('required', 'Data Inicial é obrigatório', function (value) {
      const relatorio = this.parent.relatorio;
      if (relatorio?.id === 'estoque-atual') return true;
      return !!value;
    }),
    dataFinal: yup.string().test('required', 'Data Final é obrigatório', function (value) {
      const relatorio = this?.parent.relatorio;
      if (relatorio?.id === 'estoque-atual') return true;
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
      tipoPeriodo: 'vendas',
    },
  });

  const { setValue, watch } = methods;
  const values = watch();

  const onSubmit = async (data: IRelatorioCreate) => {
    setLoader(true);
    const unidade = getLocalItem('unidade');
    const dataWithUnidade = {
      ...data,
      unidade: unidade.url,
    };
    
    handleCreat(dataWithUnidade as IRelatorioCreate);
  };

  const handleCreat = async (data: IRelatorioCreate) => {
    relatorioService
      .create(data)
      .then(() => {
        enqueueSnackbar('Relatório Gerado com sucesso');
      })
      .catch((error) => handleErrors(error, 'Erro ao gerar relatório'))
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (values.dataInicial && values.dataFinal) setValue('dataFinal', values.dataInicial);
  }, [values.dataInicial]);

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
                name="dataInicial"
                label="Data inicial"
                disabled={values?.relatorio?.id === 'estoque-atual'}
              />
              <RHFDatePicker
                name="dataFinal"
                label="Data Final"
                minDate={new Date(values?.dataInicial || '')}
                disabled={!values.dataInicial || values?.relatorio?.id === 'estoque-atual'}
              />
              <RHFTextField name="campo-1" label="Campo 1" />
              <RHFTextField name="campo-2" label="Campo 2" />
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
