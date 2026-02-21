import { IEstoqueContext, IFiscalMercadoria, ISolicitacaoAjusteItemItens } from '@/models';
import { solicitacaoAjusteService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFAutocomplete, RHFFormProvider, RHFSelect, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { fNumber, yup } from '@softlutions/utils';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  context: IEstoqueContext;
}

export function SolicitacaoAjusteDialogMercadoriaCreateEditForm({ context }: Props) {
  const handleError = useError();

  const { setValue: setValueList, watch: watchList } = useFormContext();
  const { currentRow, dataTable } = watchList();

  if (!currentRow?.renderForm) return null;

  const [listaProdutos, setListaProdutos] = useState<IFiscalMercadoria[]>([]);

  const validationSchema = yup.object().shape({
    id: yup.number().optional(),
    searchProduto: yup.mixed().required('Mercadoria é obrigatória'),
    descricao: yup.string().required('Descrição'),
    saldoCalcular: yup
      .number()
      .required('Saldo a calcular')
      .test('saldoCalcular', 'Saldo a calcular deve ser maior que 0', (value) => Number(value) > 0),
    operacao: yup.number().required('Operação'),
    motivo: yup.string().min(10, 'Motivo deve ter no mínimo de 10 caracteres'),
    deletar: yup.boolean(),
  });

  const defaultValues = useMemo(() => {
    return {
      id: currentRow?.id || '',
      searchProduto: currentRow?.descricao
        ? { id: currentRow?.id, descricao: currentRow?.descricao }
        : null,
      descricao: currentRow?.descricao || '',
      saldoCalcular: currentRow?.saldoCalcular ?? '',
      operacao: currentRow?.operacao ?? '',
      motivo: currentRow?.motivo || '',
      deletar: currentRow?.deletar ?? false,
    };
  }, [currentRow]);

  const methods = useForm({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: any) => {
    data.id = fNumber('interger', data.id);
    data.saldoCalcular = fNumber('interger', data.saldoCalcular);
    data.deletar = false;
    delete data.searchProduto;

    !currentRow?.id ? handleCreat(data) : handleUpdate(data);
  };

  const handleCreat = (data: any) => {
    setValueList('dataTable', [...dataTable, data]);
    setValueList('currentRow', null);
    reset(defaultValues);
  };

  const handleUpdate = (data: any) => {
    const index = dataTable.findIndex((item: any) => item.id === data.id && !item.deletar);
    const newDataTable = [...dataTable];
    newDataTable[index] = data;

    setValueList('dataTable', newDataTable);
    setValueList('currentRow', null);
    reset(defaultValues);
  };

  const handleInputChange = (_: any, newInputValue: string) => {
    if (newInputValue.length >= 1) {
      solicitacaoAjusteService
        .findAllMercadoria(newInputValue)
        .then((response) => setListaProdutos(response))
        .catch((error) => handleError(error, 'Erro na busca de produtos'));
    }
    if (newInputValue.length === 0) setListaProdutos([]);
  };

  const handleChange = (_: any, newValue: any) => {
    if (!newValue) return;
    setValue('searchProduto', ['', null, undefined].includes(newValue as any) ? null : newValue, {
      shouldValidate: true,
    });
    if (newValue && !currentRow?.id) {
      Object.keys(newValue).map((key) => {
        if (key === 'operacao') return;
        setValue(key as keyof ISolicitacaoAjusteItemItens, newValue[key], {
          shouldValidate: true,
        });
      });
    } else {
      reset(defaultValues);
    }
  };

  const handleClose = () => {
    setValueList('currentRow', null);
    reset();
  };

  useEffect(() => {
    if (currentRow) reset(defaultValues);
  }, [currentRow, reset, defaultValues]);

  useEffect(() => {
    solicitacaoAjusteService
      .findAllMercadoria()
      .then((response) => setListaProdutos(response))
      .catch((error) => handleError(error, 'Erro na busca de produtos'));
  }, []);

  return (
    <Dialog fullWidth maxWidth="md" open={!!currentRow} onClose={handleClose}>
      <RHFFormProvider methods={methods}>
        <DialogTitle mt={-1}>{currentRow?.id ? 'Editar' : 'Adicionar'} Mercadoria</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} columnSpacing={2} mb={-0.5}>
            <Grid xs={12} mt={1}>
              <RHFAutocomplete
                fullWidth
                name="searchProduto"
                label="Mercadoria"
                freeSolo
                disabled={!!currentRow?.id}
                options={listaProdutos.filter(
                  (itemProduto) =>
                    !dataTable.some(
                      (itemTable: any) =>
                        itemTable?.id?.toString() === itemProduto?.id?.toString() &&
                        !itemTable?.deletar,
                    ),
                )}
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
                noOptionsText="Nenhum item encontrado"
              />
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações gerais
              </Typography>
            </Grid>

            <Grid xs={12} md={1}>
              <RHFTextField
                size="small"
                name="id"
                label="Código"
                InputLabelProps={{ shrink: true }}
                placeholder="0"
                disabled
              />
            </Grid>
            <Grid xs={12} md={5}>
              <RHFTextField size="small" name="descricao" label="Descrição" disabled />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="saldoCalcular"
                label="Saldo a calcular"
                mask="number"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFSelect size="small" name="operacao" label="Operação">
                {context.operacaoAjusteManual.map((option) => (
                  <MenuItem key={option.cod} value={option.cod}>
                    {option.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid xs={12}>
              <RHFTextField name="motivo" label="Motivo" multiline rows={4} />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ mr: 2, mt: 1 }}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Voltar
          </Button>

          <Button
            type="button"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {currentRow?.descricao ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
