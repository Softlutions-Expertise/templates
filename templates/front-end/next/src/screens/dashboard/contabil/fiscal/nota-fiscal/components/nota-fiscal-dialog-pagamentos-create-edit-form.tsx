import { IFiscalContext, IFiscalPagamentos } from '@/models';
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
import { mask, yup } from '@softlutions/utils';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';

import { RHFDatePicker, RHFFormProvider, RHFSelect, RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

interface Props {
  context: IFiscalContext;
}

export function NotaFiscalDialogPagamentosCreateEditForm({ context }: Props) {
  const { setValue: setValueList, watch: watchList } = useFormContext();
  const { currentRow, dataTable } = watchList();

  if (!currentRow?.renderForm) return null;

  const [activateForm, setActivateForm] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    id: yup.number().nullable(),
    formaPagamento: yup.string().required('Forma de pagamento'),
    tipoPagamento: yup.string().required('Tipo de pagamento'),
    valorPagamento: yup.number().required('Valor do pagamento'),
    dataPagamento: yup.string().required('Data do pagamento'),
    card: yup.lazy((_, { parent: { formaPagamento } }) =>
      [3, 4, 17].includes(formaPagamento)
        ? yup.object({
            tipoIntegracao: yup.string().required('Tipo de integração'),
            credenciadoraCnpj: yup.string().required('CNPJ da credenciadora'),
            bandeiraCartao: yup.string().required('Bandeira do cartão'),
            pagamentoAutorizacao: yup.string().required('Autorização do pagamento'),
          })
        : yup.object().notRequired(),
    ),
    deletar: yup.boolean(),
  });

  const defaultValues = useMemo(() => {
    return {
      id: Number(currentRow?.id) || dataTable?.length + 1,
      formaPagamento: Number(currentRow?.formaPagamento?.cod || currentRow?.formaPagamento) ?? 0,
      tipoPagamento: Number(currentRow?.tipoPagamento?.cod || currentRow?.tipoPagamento) ?? 0,
      valorPagamento: currentRow?.valorPagamento ?? 0,
      dataPagamento: currentRow?.dataPagamento || '',
      card: currentRow?.card || {
        tipoIntegracao:
          Number(currentRow?.card?.tipoIntegracao?.cod || currentRow?.card?.tipoIntegracao) ?? '',
        credenciadoraCnpj: currentRow?.card?.credenciadoraCnpj,
        bandeiraCartao:
          Number(currentRow?.card?.bandeiraCartao?.cod || currentRow?.card?.bandeiraCartao) ?? '',
        pagamentoAutorizacao: currentRow?.card?.pagamentoAutorizacao,
      },
      deletar: currentRow?.deletar ?? false,
    };
  }, [currentRow]);

  const methods = useForm({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
  });

  const {
    formState: { isSubmitting },
    reset,
    watch,
  } = methods;

  const values = watch();

  const onSubmit = (data: any) => {
    data.deletar = false;
    data.tipoPagamento = Number(data.tipoPagamento);
    data.formaPagamento = Number(data.formaPagamento);
    if (data?.mask) delete data?.mask;
    if (data?.card?.credenciadoraCnpj)
      data.card.credenciadoraCnpj = mask.unmasked(data.card.credenciadoraCnpj);
    if (![3, 4, 17].includes(Number(data?.formaPagamento))) data.card = null;

    !currentRow?.id ? handleCreat(data) : handleUpdate(data);
  };

  const handleCreat = (data: any) => {
    const index = dataTable.findIndex((item: IFiscalPagamentos) => item.id === data.id);
    if (index !== -1) {
      dataTable[index] = data;
      setValueList('dataTable', [...dataTable]);
      setValueList('currentRow', null);
      reset(defaultValues);
    } else {
      setValueList('dataTable', [...dataTable, data]);
      setValueList('currentRow', null);
      reset(defaultValues);
    }
  };

  const handleUpdate = (data: any) => {
    const index = dataTable.findIndex((item: IFiscalPagamentos) => item.id === data.id);
    dataTable[index] = data;
    setValueList('dataTable', [...dataTable]);
    setValueList('currentRow', null);
    reset(defaultValues);
  };

  useEffect(() => {
    if (currentRow) {
      reset(defaultValues);
    }
  }, [currentRow, reset, defaultValues]);

  const handleClose = () => {
    setValueList('currentRow', null);
    reset();
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={!!currentRow} onClose={handleClose}>
      <RHFFormProvider
        methods={methods}
        onSubmit={onSubmit}
        activateForm={activateForm}
        setActivateForm={setActivateForm}
      >
        <DialogContent dividers>
          <Grid container spacing={3} columnSpacing={2} mt={3}>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações do Pagamento
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="flex-start">
                {currentRow?.id && <RHFTextField size="small" name="id" label="Código" disabled />}
                <RHFSelect size="small" name="formaPagamento" label="Forma de Pagamento">
                  {context?.formaPagamento?.map((item) => (
                    <MenuItem key={Number(item.cod)} value={Number(item.cod)}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect size="small" name="tipoPagamento" label="Tipo de Pagamento">
                  {context?.tipoPagamento?.map((item) => (
                    <MenuItem key={Number(item.cod)} value={Number(item.cod)}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFTextField size="small" name="valorPagamento" label="Valor" mask="money" />
                <RHFDatePicker size="small" name="dataPagamento" label="Data do Pagamento" />
              </Stack>
            </Grid>

            {[3, 4, 17].includes(values.formaPagamento) && (
              <>
                <Grid xs={12}>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Informações do Cartão
                  </Typography>
                </Grid>

                <Grid xs={12} md={3}>
                  <RHFSelect size="small" name="card.tipoIntegracao" label="Tipo de Integração">
                    {context?.tipoIntegracao?.map((item) => (
                      <MenuItem key={Number(item.cod)} value={Number(item.cod)}>
                        {item.descricao}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid xs={12} md={3}>
                  <RHFTextField
                    size="small"
                    name="card.credenciadoraCnpj"
                    label="CNPJ Credenciadora"
                    mask="cnpj"
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <RHFSelect size="small" name="card.bandeiraCartao" label="Bandeira do Cartão">
                    {context?.bandeiraCartao?.map((item) => (
                      <MenuItem key={Number(item.cod)} value={Number(item.cod)}>
                        {item.descricao}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid xs={12} md={3}>
                  <RHFTextField size="small" name="card.pagamentoAutorizacao" label="Autorização" />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ mr: 2 }}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Voltar
          </Button>

          <Button
            type="button"
            variant="contained"
            disabled={isSubmitting}
            onClick={() => {
              setActivateForm(true);
            }}
          >
            {currentRow?.id ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
