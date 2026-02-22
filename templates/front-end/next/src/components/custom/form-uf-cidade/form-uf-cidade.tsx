'use client';

import { enderecoService } from '@/services';
import { MenuItem, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { RHFSelect } from '@softlutions/components';

// ----------------------------------------------------------------------

interface Props {
  names: {
    estado: string;
    cidade: string;
    cidadeNome?: string;
  };
  startFirstColumn?: any;
  endFirstColumn?: any;
  InputLabelPropsCidade?: any;
  InputLabelPropsEstado?: any;
}

export function FormUfCidade({
  names,
  startFirstColumn,
  InputLabelPropsCidade,
  InputLabelPropsEstado,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { watch, setValue } = useFormContext();

  const [listaEstados, setListaEstados] = useState([]);
  const [listaCidades, setListaCidades] = useState<any>([]);

  const values = watch();

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
    if (values?.[names.estado]) {
      enderecoService
        .findAllCidadeByIdEstado(values?.[names.estado])
        .then((response) => {
          setListaCidades(response.data?.data || response.data || []);
        })
        .catch(() => {
          enqueueSnackbar('Serviço de cidade indisponível', {
            variant: 'error',
          });
        });
    }
  }, [values?.[names.estado]]);

  useEffect(() => {
    if (names.cidadeNome) {
      setValue(
        names.cidadeNome,
        listaCidades?.find((cidade: any) => cidade.id === values?.[names.cidade])?.nome ||
          values?.[names.cidadeNome] ||
          '',
      );
    }
  }, [values?.[names.cidade]]);

  return (
    <>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        {startFirstColumn}

        <RHFSelect fullWidth name={names.estado} label="UF" InputLabelProps={InputLabelPropsEstado}>
          {listaEstados?.map((item: any) => (
            <MenuItem key={item.codIbge} value={item.codIbge}>
              {item.sigla}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFSelect
          fullWidth
          name={names.cidade}
          label="Cidade"
          disabled={!values?.[names.estado]}
          InputLabelProps={InputLabelPropsCidade}
        >
          {listaCidades?.map((cidade: any) => (
            <MenuItem key={cidade.id} value={cidade.id}>
              {cidade.nome}
            </MenuItem>
          ))}
        </RHFSelect>
      </Stack>
    </>
  );
}
