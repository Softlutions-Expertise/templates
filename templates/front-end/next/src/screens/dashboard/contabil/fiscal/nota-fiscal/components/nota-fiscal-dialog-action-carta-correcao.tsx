'use client';

import { INotaFiscalCreateUpdate, INotaFiscalFinalizeForm } from '@/models';
import { pages, useRouter } from '@/routes';
import { notaFiscalService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material';
import { RHFFormProvider, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { yup } from '@softlutions/utils';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  finalizeForm: INotaFiscalFinalizeForm;
  setFinalizeForm: (value: INotaFiscalFinalizeForm) => void;
  currentData?: INotaFiscalCreateUpdate;
}

export function NotaFiscalDialogActionCartaCorrecao({
  finalizeForm,
  setFinalizeForm,
  currentData,
}: Props) {
  const router = useRouter();
  const handleError = useError();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    justificativa: yup.string().min(15, 'Justificativa deve ter no mínimo de 15 caracteres'),
  });

  const defaultValues = useMemo(() => {
    return {
      justificativa: '',
    };
  }, []);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = useCallback(async (data: any) => {
    setLoading(true);
    handleDecidir(data);
  }, []);

  const handleDecidir = (data: any) => {
    notaFiscalService
      .cartaCorrecao({ ...data, id: Number(currentData?.id) })
      .then(() => {
        enqueueSnackbar('Carta de correção enviada com sucesso!');
        router.push(pages.dashboard.contabil.fiscal.notaFiscal.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao enviar carta de correção!'))
      .finally(() => handleClose());
  };

  const handleClose = () => {
    setFinalizeForm({ ...finalizeForm, type: 'default' });
    setLoading(false);
    reset();
  };

  return (
    <Dialog fullWidth maxWidth="md" open={finalizeForm?.type === 'cartaCorrecao'} onClose={handleClose}>
      <RHFFormProvider methods={methods}>
        <DialogContent>
          <Stack sx={{ mt: 3 }}>
            <RHFTextField name="justificativa" label="Justificativa" multiline rows={4} />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ mr: 2 }}>
          <LoadingButton
            type="button"
            variant="contained"
            color="warning"
            onClick={() => handleSubmit((data) => onSubmit(data))()}
            loading={loading}
          >
            Enviar Carta de Correção
          </LoadingButton>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Voltar
          </Button>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
