'use client';
import { RHFDatePicker, RHFSelect } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { ICaixaFindAll } from '@/models';
import { caixaService } from '@/services';
import { fDate } from '@softlutions/utils';
import { MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  names: {
    dateStart: string;
    caixa: string;
  };
  onlyUser?: boolean;
  fullGrid?: boolean;
  disabledAll?: boolean;
  gridCaixa?: number;
  gridData?: number;
}

export const LancamentoCaixa = ({
  names,
  fullGrid,
  disabledAll,
  gridCaixa,
  gridData,
}: Props) => {
  const handleError = useError();


  const { setValue, watch } = useFormContext();

  const [caixaList, setCaixaList] = useState<ICaixaFindAll[]>([]);

  useEffect(() => {
    if (watch(names.dateStart)) {
      const data = {
        params: {
          page: 2,
          linesPerPage: 10,
        },
        data: {
          dataInicial: fDate('yyyy-MM-dd', watch(names.dateStart)),
          dataFinal: fDate('yyyy-MM-dd', watch(names.dateStart)),
          operador: '',
        },
      };
      caixaService.findAll(data)
        .then((response) => setCaixaList(response.content))
        .catch((error) => handleError(error, 'Serviço de Lancamento indisponível'));
    }
  }, [watch(names.dateStart)]);

  useEffect(() => {
    if (watch(names.caixa)) {
      const caixa = caixaList?.find((item) => item.id === Number(watch(names.caixa)))?.operador?.id;
      setValue('extra.operadorId', caixa);
    }
  }, [watch(names.caixa), caixaList]);

  return (
    <>
      <Grid xs={gridData ? gridData : fullGrid ? 4 : 2} sx={{ mt: 1 }}>
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <RHFDatePicker
            name={names.dateStart}
            label="Data"
            size="small"
            disabled={disabledAll}
            maxDate={new Date()}
          />
        </Stack>
      </Grid>
      <Grid xs={gridCaixa ? gridCaixa : fullGrid ? 8 : 4} sx={{ mt: 1 }}>
        <RHFSelect
          name={names.caixa}
          label="Caixa"
          size="small"
          cleanFild
          disabled={!watch(names.dateStart) || disabledAll}
        >
          {caixaList?.map((item) => (
            <MenuItem key={item?.id} value={item?.id}>
              {item?.operador?.nome} - {item?.dataHoraAbertura?.slice(11, 16)} -{' '}
              {item?.dataHoraFechamento?.slice(11, 16) || 'Aberto'}
            </MenuItem>
          ))}
        </RHFSelect>
      </Grid>
    </>
  );
};
