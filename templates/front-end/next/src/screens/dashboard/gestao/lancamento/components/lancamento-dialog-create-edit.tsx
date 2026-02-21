'use client';

import { RHFFormProvider, RHFSelect, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { ICaixaContext, ILancamentoCreateEdit } from '@/models';
import { caixaService, lancamentoService } from '@/services';
import { removeEmptyFields, yup } from '@softlutions/utils';
import { getCodFromObject } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LANCAMENTO_ENUM } from '../enums';
import { LancamentoCaixa } from './lancamento-caixa';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

interface Props {
  open: boolean;
  onClose: () => void;
  currentData?: ILancamentoCreateEdit;
}

export const LancamentoDialogCreateEdit = ({ open, onClose, currentData }: Props) => {
  if (!open) return <></>;

  const handleError = useError();

  const { enqueueSnackbar } = useSnackbar();

  const [activateForm, setActivateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<ICaixaContext>();

  const validationShema = yup.object().shape({
    dataInicial: yup.string().required('Data Inicial'),
    caixa: yup.number().required('Caixa'),
    formaPagamento: yup.number().required('Forma de Pagamento'),
    subFormaPagamento: yup.number().test(
      'required',
      'Sub Forma de Pagamento',
      function (this: any, value) {
        return [3, 4].includes(this.parent.formaPagamento) ? !!value : true;
      },
    ),
    operacao: yup.number().required('Operação'),
    valor: yup.number().required('Valor'),
    documentoComplementar: yup.string().nullable(),
    observacoes: yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      dataInicial: currentData?.dataInicial || '',
      caixa: currentData?.caixa || '',
      formaPagamento: getCodFromObject(currentData?.formaPagamento) ?? '',
      subFormaPagamento: getCodFromObject(currentData?.subFormaPagamento) ?? '',
      operacao: getCodFromObject(currentData?.operacao) ?? '',
      valor: currentData?.valor ?? '',
      documentoComplementar: currentData?.documentoComplementar ?? '',
      observacoes: currentData?.observacoes || '',
    }),
    [currentData],
  );

  const methods = useForm({
    resolver: yupResolver(validationShema) as any,
    defaultValues,
  });

  const { watch } = methods;
  const values = watch();

  const onSubmit = async (data: ILancamentoCreateEdit) => {
    setLoading(true);

    if (![3, 4].includes(Number(data.formaPagamento))) {
      delete data.subFormaPagamento;
    }
    if (!currentData?.id) {
      lancamentoService.create(removeEmptyFields(data) as ILancamentoCreateEdit)
        .then(() => {
          enqueueSnackbar('Lançamento registrado com sucesso');
          onClose();
        })
        .catch((error) => handleError(error, 'Erro ao registrar Lançamento'))
        .finally(() => setLoading(false));
    } else {
      lancamentoService.update(
        removeEmptyFields({ ...data, id: currentData?.id }) as ILancamentoCreateEdit,
      )
        .then(() => {
          enqueueSnackbar('Lançamento atualizado com sucesso');
          onClose();
        })
        .catch((error) => handleError(error, 'Erro ao atualizar Lançamento'))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    caixaService.context()
      .then((response) => setContext(response))
      .catch((error) => handleError(error, 'Serviço de Caixa indisponível'));
  }, []);

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <RHFFormProvider
        methods={methods}
        onSubmit={onSubmit}
        activateForm={activateForm}
        setActivateForm={setActivateForm}
      >
        <DialogTitle sx={{ mb: -1 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            {!currentData?.id ? 'REGISTRAR' : 'EDITAR'} LANÇAMENTO
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 2 }}>
          <Grid container spacing={2}>
            <LancamentoCaixa
              names={{
                dateStart: 'dataInicial',
                caixa: 'caixa',
              }}
              onlyUser
              fullGrid
              disabledAll={!!currentData?.id}
              key={String(values?.caixa)}
            />
            <Grid xs={12}>
              <Stack direction="row" spacing={2}>
                <RHFTextField name="valor" label="Valor" mask="money" size="small" />
                <RHFSelect name="operacao" label="Operação" size="small">
                  {LANCAMENTO_ENUM.OPERACAO.map((item) => (
                    <MenuItem key={item?.cod} value={item?.cod}>
                      {item?.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFTextField name="documentoComplementar" label="Doc. Complementar" size="small" />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack direction="row" spacing={2}>
                <RHFSelect name="formaPagamento" label="Forma Pagamento" size="small">
                  {context?.formaPagamento.map((item) => (
                    <MenuItem key={item?.cod} value={item?.cod}>
                      {item?.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                {values?.formaPagamento && [3, 4].includes(Number(values?.formaPagamento)) && (
                  <RHFSelect
                    name="subFormaPagamento"
                    label="Sub Forma Pagamento"
                    size="small"
                    key={values?.formaPagamento}
                  >
                    {context?.subFormaPagamento.map((item) => (
                      <MenuItem key={item?.cod} value={item?.cod}>
                        {item?.descricao}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
            </Grid>

            <Grid xs={12}>
              <RHFTextField
                name="observacoes"
                label="Observações"
                multiline
                rows={2}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mt: -2 }}>
          <Button variant="outlined" color="primary" onClick={onClose}>
            VOLTAR
          </Button>
          <LoadingButton
            variant="contained"
            color="success"
            onClick={() => setActivateForm(true)}
            loading={loading}
          >
            {!currentData?.id ? 'REGISTRAR' : 'ATUALIZAR'}
          </LoadingButton>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
};
