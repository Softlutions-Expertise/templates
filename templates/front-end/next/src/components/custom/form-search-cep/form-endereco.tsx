'use client';

import { enderecoService } from '@/services';
import { Box, CircularProgress, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { mask } from '@softlutions/utils';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { RHFSelect, RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

interface Props {
  loader?: boolean;
  names?: {
    cep: string;
    cidade: string;
    cidadeNome?: string;
    estado: string;
    logradouro: string;
    bairro: string;
    numero: string;
    complemento?: string;
  };
  startFirstColumn?: any;
  endFinalColumn?: any;
  InputLabelPropsCidade?: any;
  InputLabelPropsEstado?: any;
  skipFirstFill?: boolean;
  disabledAll?: boolean;
}

export function FormEndereco({
  loader,
  names = {
    cep: 'enderecoCep',
    estado: 'enderecoEstadoIbge',
    cidade: 'enderecoCidadeIbge',
    cidadeNome: 'enderecoCidade',
    logradouro: 'enderecoLogradouro',
    bairro: 'enderecoBairro',
    numero: 'enderecoNumero',
    complemento: 'enderecoComplemento',
  },
  startFirstColumn,
  endFinalColumn,
  skipFirstFill = false,
  InputLabelPropsCidade,
  InputLabelPropsEstado,
  disabledAll = false,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { watch, setValue, getValues } = useFormContext();

  const [errorCep, setErrorCep] = useState(false);
  const [render, setRender] = useState(false);

  const [listaEstados, setListaEstados] = useState([]);
  const [listaCidades, setListaCidades] = useState<any>([]);
  const [loadingCep, setLoadingCep] = useState(false);

  const values = watch();
  const skipFirstFillRef = useRef(skipFirstFill);

  useEffect(() => {
    enderecoService
      .findAllEstado()
      .then((response) => {
        setListaEstados(response.data?.data || response.data || []);
      })
      .catch(() => {
        enqueueSnackbar('Serviço de estados indisponível', {
          variant: 'error',
        });
      });
  }, []);

  useEffect(() => {
    if (values?.[names?.estado]) {
      enderecoService
        .findAllCidadeByIdEstado(values?.[names?.estado])
        .then((response) => {
          setListaCidades(response.data?.data || response.data || []);
        })
        .catch(() => {
          enqueueSnackbar('Serviço de cidade indisponível', {
            variant: 'error',
          });
        });
    }
  }, [values?.[names?.estado]]);

  useEffect(() => {
    setRender(true);
    if (render) {
      if (skipFirstFillRef.current) {
        skipFirstFillRef.current = false;
        return;
      }

      if (mask.unmasked(values?.[names?.cep]).length == 8 && !loader) {
        setLoadingCep(true);
        setTimeout(() => {
          enderecoService
            .findOneEnderecoByCep(mask.unmasked(values?.[names?.cep]))
            .then((response) => {
              const data = response.data?.data || response.data;
              setErrorCep(false);
              setValue(names?.estado, data?.cidade?.estado?.id, { shouldValidate: true });
              setValue(names?.cidade, data?.cidade?.id, { shouldValidate: true });
              setValue(names?.logradouro, data?.logradouro, { shouldValidate: true });
              setValue(names?.bairro, data?.bairro, { shouldValidate: true });

              if (names?.cidadeNome) setValue(names?.cidadeNome, data?.cidade?.nome);
            })
            .catch(() => {
              enqueueSnackbar('CEP não encontrado', {
                variant: 'warning',
              });

              setErrorCep(true);

              setValue(names?.estado, '');
              setValue(names?.cidade, '');
              setValue(names?.logradouro, '');
              setValue(names?.bairro, '');

              if (names?.cidadeNome) setValue(names?.cidadeNome, '');
            })
            .finally(() => setLoadingCep(false));
        }, 1500);
      }
      2000;
    }
  }, [values?.[names?.cep]]);

  useEffect(() => {
    if (names?.cidadeNome) {
      setValue(
        names?.cidadeNome,
        listaCidades?.find((cidade: any) => cidade.id === values?.[names?.cidade])?.nome ||
          values?.[names?.cidadeNome] ||
          '',
      );
    }
  }, [values?.[names?.cidade]]);

  return (
    <>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 3 }}>
        {startFirstColumn}
        <RHFTextField
          name={names?.cep}
          label="CEP"
          mask="cep"
          InputProps={{
            endAdornment: loadingCep && (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
              </Box>
            ),
          }}
          disabled={disabledAll}
        />

        <RHFSelect
          fullWidth
          name={names?.estado}
          value={getValues(names?.estado)}
          label="UF"
          disabled={!errorCep || disabledAll}
          InputLabelProps={InputLabelPropsEstado}
        >
          {listaEstados?.map((item: any) => (
            <MenuItem key={item.codIbge} value={item.codIbge}>
              {item.sigla}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFSelect
          fullWidth
          name={names?.cidade}
          value={getValues(names?.cidade)}
          label="Cidade"
          disabled={!errorCep || !values?.[names?.estado] || disabledAll}
          InputLabelProps={InputLabelPropsCidade}
        >
          {listaCidades?.map((cidade: any) => (
            <MenuItem key={cidade.id} value={cidade.id}>
              {cidade.nome}
            </MenuItem>
          ))}
        </RHFSelect>
      </Stack>
      <Grid container spacing={3} columnSpacing={2}>
        <Grid xs={12} md={5}>
          <RHFTextField name={names?.logradouro} label="Logradouro" disabled={disabledAll} />
        </Grid>
        <Grid xs={12} md={5}>
          <RHFTextField name={names?.bairro} label="Bairro" disabled={disabledAll} />
        </Grid>
        <Grid xs={12} md={2}>
          <RHFTextField name={names?.numero} label="Número" disabled={disabledAll} />
        </Grid>
      </Grid>
      {names?.complemento && (
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 3 }}>
          <RHFTextField name={names?.complemento} label="Complemento" disabled={disabledAll} />
          {endFinalColumn}
        </Stack>
      )}
    </>
  );
}
