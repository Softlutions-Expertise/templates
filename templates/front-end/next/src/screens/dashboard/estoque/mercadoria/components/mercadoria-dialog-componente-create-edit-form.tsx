'use client';

import {
  IMercadoriaComponenteContext,
  IMercadoriaComponenteListagem,
  IMercadoriaFindAll,
  ITipoComponente,
} from '@/models';
import { mercadoriaService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useError } from '@softlutions/hooks';
import { fNumber, yup } from '@softlutions/utils';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';

import {
  RHFAutocomplete,
  RHFFormProvider,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from '@softlutions/components';

interface Props {
  context: IMercadoriaComponenteContext;
}

// ----------------------------------------------------------------------

export function MercadoriaDialogComponenteCreateEditForm({ context }: Props) {
  const handleError = useError();
  const { setValue: setValueList, watch: watchList } = useFormContext();
  const { currentRow, dataTable } = watchList();

  if (!currentRow?.renderForm) return null;

  const [activateForm, setActivateForm] = useState<boolean>(false);

  const [listaMercadorias, setListaMercadorias] = useState<IMercadoriaFindAll[]>([]);

  const tiposComponente: ITipoComponente[] = context?.tipoComponente ?? [];

  const validationSchema = yup.object().shape({
    searchMercadoria: yup.mixed().required('Mercadoria é obrigatória'),
    ativo: yup.boolean(),
    totalizador: yup.boolean(),
    id: yup.number().required('Código'),
    tipoComponente: yup.number().required('Tipo de componente'),
    quantidade: yup.number().required('Quantidade'),
    valorUnitario: yup.number().required('Valor unitário'),
    valorTotalItem: yup.number().required('Valor total do item'),
  });

  const defaultValues = useMemo(
    () => ({
      searchMercadoria: currentRow?.searchMercadoria
        ? currentRow.searchMercadoria
        : currentRow?.id
        ? { id: currentRow.id, descricao: currentRow.descricao }
        : null,
      ativo: currentRow?.ativo ?? true,
      totalizador: currentRow?.totalizador ?? true,
      id: currentRow?.id ? Number(currentRow.id) : 0,
      tipoComponente: currentRow?.tipoComponente || '',
      quantidade: currentRow?.quantidade || null,
      valorUnitario: currentRow?.valorUnitario ?? 0,
      valorTotalItem: currentRow?.valorTotalItem ?? 0,
    }),
    [currentRow],
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
  });

  const {
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = (data: any) => {
    data.deletar = false;
    data.tipoComponente = tiposComponente.find((t) => t.cod === data.tipoComponente)!;
    if (!currentRow?.id) {
      handleCreat(data);
    } else {
      handleUpdate(data);
    }
  };

  const handleCreat = (data: any) => {
    const newItem: IMercadoriaComponenteListagem = {
      id: values.searchMercadoria.id,
      searchMercadoria: values.searchMercadoria,
      ativo: data.ativo,
      totalizador: data.totalizador,
      quantidade: data.quantidade,
      tipoComponente: data.tipoComponente.cod,
      descricao: data.tipoComponente.descricao,
      deletar: (data.deletar = false),
      valorUnitario: fNumber('float', data.valorUnitario),
      valorTotalItem: fNumber('float', data.valorTotalItem),
    };
    setValueList('dataTable', [...dataTable, newItem]);
    setValueList('currentRow', null);
    reset(defaultValues);
  };

  const handleUpdate = (data: any) => {
    const idx = dataTable.findIndex((item: IMercadoriaComponenteListagem) => item.id === data.id);

    if (idx !== -1) {
      const updated = [...dataTable];

      updated[idx] = {
        ...updated[idx],
        descricao: data.tipoComponente.descricao,
        quantidade: data.quantidade,
        tipoComponente: data.tipoComponente.cod,
        ativo: data.ativo,
        totalizador: data.totalizador,
        valorUnitario: fNumber('float', data.valorUnitario),
        valorTotalItem: fNumber('float', data.valorTotalItem),
      };
      setValueList('dataTable', updated);
    }
    setValueList('currentRow', null);
    reset(defaultValues);
  };

  const handleInputChange = (_: any, newInputValue: string) => {
    mercadoriaService
      .findAll({
        linesPerPage: 20,
        page: 1,
        search: newInputValue,
      })
      .then((paginated) => {
        setListaMercadorias(paginated.content || []);
      })
      .catch((error) => handleError(error, 'Erro ao consultar mercadorias'));
  };

  const handleChange = (_: any, newValue: any) => {
    setValue(
      'searchMercadoria',
      ['', null, undefined].includes(newValue as any) ? null : newValue,
      {
        shouldValidate: true,
      },
    );
  };

  const handleClose = () => {
    setValueList('currentRow', null);
    reset();
  };

  useEffect(() => {
    if (currentRow) {
      reset({
        id: currentRow.id ?? 0,
        searchMercadoria: currentRow.searchMercadoria ?? null,
        quantidade: currentRow.quantidade ?? null,
        tipoComponente: currentRow.tipoComponente ?? '',
        ativo: currentRow.ativo ?? true,
        totalizador: currentRow.totalizador ?? true,
        valorUnitario: currentRow.valorUnitario ?? 0,
        valorTotalItem: currentRow.valorTotalItem ?? 0,
      });
    }
  }, [currentRow, reset]);

  useEffect(() => {
    if (currentRow?.renderForm) {
      if (currentRow.searchMercadoria) {
        setListaMercadorias([currentRow.searchMercadoria as IMercadoriaFindAll]);
      } else {
        mercadoriaService
          .findAll({ linesPerPage: 20, page: 1, search: '' })
          .then((p) => setListaMercadorias(p.content || []))
          .catch((err) => handleError(err, 'Erro ao carregar mercadorias iniciais'));
      }
    }
  }, [currentRow]);

  useEffect(() => {
    if (values?.quantidade && values?.valorUnitario) {
      setValue(
        'valorTotalItem',
        fNumber(
          'money',
          Number(values.quantidade) * Number(fNumber('float', values.valorUnitario)),
        ),
      );
    }
  }, [values?.quantidade, values?.valorUnitario]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={!!currentRow?.renderForm}
      onClose={() => {
        setValueList('currentRow', null);
        reset();
      }}
    >
      <RHFFormProvider
        methods={methods}
        onSubmit={onSubmit}
        activateForm={activateForm}
        setActivateForm={setActivateForm}
      >
        <DialogContent dividers>
          <Grid container columnSpacing={2} rowGap={3} mt={3}>
            <Grid xs={12}>
              <RHFAutocomplete
                fullWidth
                name="searchMercadoria"
                label="Buscar mercadoria"
                freeSolo
                disabled={!!currentRow?.id}
                options={listaMercadorias
                  .filter(
                    (item: any) =>
                      !dataTable.find(
                        (itemTable: any) =>
                          itemTable?.id != null &&
                          item?.id != null &&
                          itemTable.id.toString() === item.id.toString() &&
                          !itemTable.deletar,
                      ),
                  )
                  ?.map((option) => option)}
                getOptionLabel={(option: any) => option?.descricao}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <a>
                      {option.id} - {option.descricao}
                    </a>
                  </li>
                )}
                onInputChange={handleInputChange}
                onChange={handleChange}
                noOptionsText="Nenhuma mercadoria encontrada"
              />
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Componentes
              </Typography>
            </Grid>

            <Grid xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <RHFSwitch name="ativo" label="Ativo" />
                <RHFSwitch name="totalizador" label="Totalizador" />
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <RHFSelect name="tipoComponente" label="Tipo">
                  {tiposComponente.map((tipo) => (
                    <MenuItem key={tipo.cod} value={tipo.cod}>
                      {tipo.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFTextField name="quantidade" label="Quantidade" mask="number" />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <RHFTextField name="valorUnitario" label="Valor Unitário" mask="money" />
                <RHFTextField
                  name="valorTotalItem"
                  label="Valor Total do Item"
                  mask="money"
                  disabled
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ mr: 2 }}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Voltar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            onClick={methods.handleSubmit(onSubmit)}
          >
            {currentRow?.id ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
