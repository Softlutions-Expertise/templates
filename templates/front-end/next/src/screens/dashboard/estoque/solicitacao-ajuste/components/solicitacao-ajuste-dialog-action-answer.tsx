'use client';

import { ISolicitacaoAjusteFinalizeForm } from '@/models';
import { pages, useParams, useRouter } from '@/routes';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { yup } from '@softlutions/utils';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { solicitacaoAjusteService } from '@/services/dashboard/estoque';

// ----------------------------------------------------------------------

type Params = 'aprovar' | 'rejeitar' | 'cancelar' | 'default';
interface Props {
  finalizeForm: ISolicitacaoAjusteFinalizeForm;
  setFinalizeForm: (value: ISolicitacaoAjusteFinalizeForm) => void;
}

export function SolicitacaoAjusteDialogActionAnswer({ finalizeForm, setFinalizeForm }: Props) {
  const router = useRouter();
  const handleError = useError();

  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<{
    load: boolean;
    type: Params;
  }>({ load: false, type: 'default' });

  const validationSchema = yup.object().shape({
    status: yup.mixed(),
    motivo: yup.string().min(10, 'Motivo deve ter no mínimo de 10 caracteres'),
  });

  const defaultValues = useMemo(() => {
    return {
      status: '',
      motivo: '',
    };
  }, []);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = useCallback(async (data: any, type: Params) => {
    setLoading({ type, load: true });
    handleDecidir(data, type);
  }, []);

  const handleDecidir = (data: any, type: Params) => {
    let messageType: any;

    switch (type) {
      case 'aprovar':
        messageType = 'Aprovado';
        data.status = 3;
        break;
      case 'rejeitar':
        messageType = 'Rejeitado';
        data.status = 4;
        break;
      default:
        messageType = 'Cancelado';
        data.status = 2;
    }

    solicitacaoAjusteService
      .decidir({ ...data, id })
      .then(() => {
        enqueueSnackbar(`${messageType} com sucesso!`);
        router.push(pages.dashboard.estoque.solicitacaoAjuste.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao enviar solicitação de ajuste!'))
      .finally(() => {
        setFinalizeForm({ ...finalizeForm, type: 'default', load: false });
        setLoading({ type: 'default', load: false });
      });
  };

  const handleClose = () => {
    setFinalizeForm({ ...finalizeForm, type: 'default' });
    reset();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={['responder', 'cancelar'].includes(finalizeForm.type)}
      onClose={handleClose}
    >
      <RHFFormProvider methods={methods}>
        <DialogContent dividers>
          <Grid container spacing={3} columnSpacing={2} sx={{ mt: 2 }}>
            <Grid xs={12}>
              <RHFTextField name="motivo" label="Motivo" multiline rows={4} />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ mr: 2 }}>
          {finalizeForm.type === 'cancelar' && (
            <LoadingButton
              type="button"
              variant="contained"
              color="error"
              onClick={() => handleSubmit((data) => onSubmit(data, 'cancelar'))()}
              loading={loading.type === 'cancelar' && loading.load}
            >
              Cancelar
            </LoadingButton>
          )}
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Voltar
          </Button>
          {finalizeForm.type === 'responder' && (
            <>
              <LoadingButton
                type="button"
                variant="contained"
                color="secondary"
                onClick={() => handleSubmit((data) => onSubmit(data, 'rejeitar'))()}
                loading={loading.type === 'rejeitar' && loading.load}
              >
                Rejeitar
              </LoadingButton>

              <LoadingButton
                type="button"
                variant="contained"
                color="success"
                onClick={() => handleSubmit((data) => onSubmit(data, 'aprovar'))()}
                loading={loading.type === 'aprovar' && loading.load}
              >
                Aprovar
              </LoadingButton>
            </>
          )}
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
