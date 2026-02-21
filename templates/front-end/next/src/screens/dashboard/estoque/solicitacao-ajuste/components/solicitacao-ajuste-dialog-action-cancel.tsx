import { IUseTableApi } from '@/components';
import { ISolicitacaoAjusteFindAll } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material';
import { RHFFormProvider, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { yup } from '@softlutions/utils';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';

import { solicitacaoAjusteService } from '@/services/dashboard/estoque';

// ----------------------------------------------------------------------

export function SolicitacaoAjusteDialogActionCancel() {
  const handleError = useError();

  const { enqueueSnackbar } = useSnackbar();

  const { watch, setValue } = useFormContext<IUseTableApi<ISolicitacaoAjusteFindAll, any>>();

  const { confirm, loading, currentRow } = watch();

  if (!currentRow) return <></>;

  const validationSchema = yup.object().shape({
    status: yup.mixed(),
    motivo: yup.string().min(10, 'Motivo deve ter no mínimo de 10 caracteres'),
  });

  const defaultValues = useMemo(() => {
    return {
      status: 2,
      motivo: '',
    };
  }, []);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = useCallback(async (data: any) => {
    handleDecidir(data);
  }, []);

  const handleDecidir = (data: any) => {
    console.log(data, currentRow);
    solicitacaoAjusteService
      .decidir({ ...data, id: currentRow?.id || 0 })
      .then(() => enqueueSnackbar('Cancelado com sucesso!'))
      .catch((error) => handleError(error, 'Erro ao enviar solicitação de ajuste!'))
      .finally(() => handleClose());
  };

  const handleClose = () => {
    setValue('confirm', false);
    setValue('loading', false);
    setValue('currentRow', null as any);
    reset();
  };

  return (
    <Dialog fullWidth maxWidth="md" open={confirm || false} onClose={handleClose}>
      <RHFFormProvider methods={methods}>
        <DialogContent sx={{ mt: 3 }}>
          <Stack sx={{ mt: 1 }}>
            <RHFTextField name="motivo" label="Motivo" multiline rows={4} />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ mr: 2 }}>
          <LoadingButton
            type="button"
            variant="contained"
            color="error"
            onClick={() => handleSubmit((data) => onSubmit(data))()}
            loading={loading}
          >
            Cancelar
          </LoadingButton>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Voltar
          </Button>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
